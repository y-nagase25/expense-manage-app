"use server"

import { prisma } from "@/lib/db"

export async function getJournalEntries() {
    return await prisma.journalEntry.findMany();
}