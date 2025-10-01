"use server"

import { FormResponse } from "@/app/types";
import { prisma } from "@/lib/db"
import { AccountTitle, Prisma, TaxCategory, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getJournalEntries() {
    return await prisma.journalEntry.findMany({
        orderBy: { occurrenceDate: 'desc' }
    });
}

export async function getJournalEntry(id: string) {
    return await prisma.journalEntry.findUnique({
        where: { id },
    });
}

export async function updateJournalEntry(formData: FormData) {
    const id = formData.get("id") as string;
    if (!id) throw new Error("Missing journalEntry id");

    try {
        await prisma.journalEntry.update({
            where: { id },
            data: {
                occurrenceDate: formData.get("occurrenceDate") as string,
                debitAccount: formData.get("debitAccount") as AccountTitle,
                debitAmount: getNum(formData, "debitAmount") as number,
                debitTax: formData.get("debitTax") as TaxCategory,
                creditAccount: formData.get("creditAccount") as AccountTitle,
                client: formData.get("client") as string,
                paymentDate: formData.get("paymentDate") as string,
                paymentAccount: formData.get("paymentAccount") as string,
                notes: formData.get("notes") as string,
            }
        });
    } catch (error) {
        console.error(error);
        redirect(`/journals/${id}?updated=0`);
    }
    revalidatePath(`/journals/${id}`);
    revalidatePath("/journals");
    redirect(`/journals/${id}?updated=1`);
}

export async function createJournalEntry(prevState: FormResponse, formData: FormData): Promise<FormResponse> {
    try {
        await prisma.journalEntry.create({
            data: {
                transactionType: formData.get("transactionType") as TransactionType,
                occurrenceDate: formData.get("occurrenceDate") as string,
                debitAccount: formData.get("debitAccount") as AccountTitle,
                debitAmount: getNum(formData, "debitAmount") as number,
                debitTax: formData.get("debitTax") as TaxCategory,
                creditAccount: formData.get("creditAccount") as AccountTitle,
                client: formData.get("client") as string,
                paymentDate: formData.get("paymentDate") as string,
                paymentAccount: formData.get("paymentAccount") as string,
                notes: formData.get("notes") as string,
            }
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            return {
                success: false,
                message: 'エラーが発生しました',
                field: formData
            };
            if (error instanceof Prisma.PrismaClientKnownRequestError) { }
        }
    }
    revalidatePath("/journals");

    return { success: true, message: '仕訳の登録が完了しました' };
}

export async function deleteJournalEntry(id: string) {
    try {
        await prisma.journalEntry.delete({
            where: { id },
        });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            // Record to delete not found
            console.warn(`journalEntry not found for id: ${id}`);
        } else {
            console.error(error);
            throw error;
        }
    }
    revalidatePath("/journals");
}

const getNum = (formData: FormData, k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' ? Number(v) : 0;
}