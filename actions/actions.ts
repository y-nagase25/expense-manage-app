"use server"

import { prisma } from "@/lib/db"
import { AccountTitle, Prisma, TaxCategory, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getJournalEntries() {
    return await prisma.journalEntry.findMany();
}

export async function createJournalEntries(formData: FormData) {
    try {
        await prisma.journalEntry.create({
            data: {
                transactionType: formData.get("transactionType") as TransactionType,
                occurrenceDate: formData.get("occurrenceDate") as string,
                debitAccount: formData.get("debitAccount") as AccountTitle,
                debitAmount: getNum(formData, "debitAmount") as number,
                debitTax: formData.get("debitTax") as TaxCategory,
                creditAccount: formData.get("creditAccount") as AccountTitle,
                creditAmount: getNum(formData, "creditAmount") as number,
                creditTax: formData.get("creditTax") as TaxCategory,
                client: formData.get("client") as string,
                paymentDate: formData.get("paymentDate") as string,
                paymentAccount: formData.get("paymentAccount") as string,
                notes: formData.get("notes") as string,
            }
        })

    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // "Unique constraint failed on the {constraint}"
        }
        console.error(error);
    }
    revalidatePath("/journal");
}

const getNum = (formData: FormData, k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' ? Number(v) : 0;
}