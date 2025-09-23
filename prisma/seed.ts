import { PrismaClient, Prisma, TransactionType, AccountTitle, TaxCategory } from "@prisma/client";

const prisma = new PrismaClient();

const seedEntries: Prisma.JournalEntryUncheckedCreateInput[] = [
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-07",
        debitAccount: AccountTitle.COMMUNICATION,
        debitAmount: 8800,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.BANK_DEPOSIT,
        creditAmount: 8800,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Google",
        paymentDate: "2025-04-07",
        paymentAccount: "PayPay銀行",
        notes: "GoogleWorkspace Usage fee",
    },
    {
        transactionType: TransactionType.INCOME,
        occurrenceDate: "2025-04-01",
        debitAccount: AccountTitle.BANK_DEPOSIT,
        debitAmount: 110000,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.SALES,
        creditAmount: 110000,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Acme Corp",
        paymentDate: "2025-04-05",
        paymentAccount: "三井住友銀行",
        notes: "Website development invoice #2025-001",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-02",
        debitAccount: AccountTitle.RENT,
        debitAmount: 88000,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.BANK_DEPOSIT,
        creditAmount: 88000,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Sunrise Properties",
        paymentDate: "2025-04-02",
        paymentAccount: "みずほ銀行",
        notes: "Office rent for April",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-03",
        debitAccount: AccountTitle.UTILITIES,
        debitAmount: 5500,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.CASH,
        creditAmount: 5500,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Tokyo Gas",
        paymentDate: "2025-04-03",
        paymentAccount: "現金",
        notes: "Gas bill",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-04",
        debitAccount: AccountTitle.SUPPLIES,
        debitAmount: 3300,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.CASH,
        creditAmount: 3300,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Stationery World",
        paymentDate: "2025-04-04",
        paymentAccount: "現金",
        notes: "Printer paper and pens",
    },
    {
        transactionType: TransactionType.INCOME,
        occurrenceDate: "2025-04-06",
        debitAccount: AccountTitle.ACCOUNTS_RECEIVABLE,
        debitAmount: 55000,
        debitTax: TaxCategory.NON_TAXABLE,
        creditAccount: AccountTitle.SALES,
        creditAmount: 55000,
        creditTax: TaxCategory.NON_TAXABLE,
        client: "Neko Cafe",
        paymentDate: "2025-04-20",
        paymentAccount: "未収入金",
        notes: "Consulting retainer (non-taxable)",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-08",
        debitAccount: AccountTitle.ADVERTISING,
        debitAmount: 22000,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.BANK_DEPOSIT,
        creditAmount: 22000,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Meta Ads",
        paymentDate: "2025-04-09",
        paymentAccount: "住信SBIネット銀行",
        notes: "April campaign",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-10",
        debitAccount: AccountTitle.UTILITIES,
        debitAmount: 7700,
        debitTax: TaxCategory.TAXABLE_8,
        creditAccount: AccountTitle.BANK_DEPOSIT,
        creditAmount: 7700,
        creditTax: TaxCategory.TAXABLE_8,
        client: "TEPCO",
        paymentDate: "2025-04-10",
        paymentAccount: "三菱UFJ銀行",
        notes: "Electricity bill",
    },
    {
        transactionType: TransactionType.INCOME,
        occurrenceDate: "2025-04-12",
        debitAccount: AccountTitle.BANK_DEPOSIT,
        debitAmount: 66000,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.SALES,
        creditAmount: 66000,
        creditTax: TaxCategory.TAXABLE_10,
        client: "Globex Inc",
        paymentDate: "2025-04-12",
        paymentAccount: "楽天銀行",
        notes: "Maintenance fee April",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-14",
        debitAccount: AccountTitle.COMMUNICATION,
        debitAmount: 13200,
        debitTax: TaxCategory.TAXABLE_10,
        creditAccount: AccountTitle.BANK_DEPOSIT,
        creditAmount: 13200,
        creditTax: TaxCategory.TAXABLE_10,
        client: "AWS",
        paymentDate: "2025-04-14",
        paymentAccount: "PayPay銀行",
        notes: "Data transfer and EC2",
    },
    {
        transactionType: TransactionType.EXPENSE,
        occurrenceDate: "2025-04-15",
        debitAccount: AccountTitle.SUPPLIES,
        debitAmount: 4400,
        debitTax: TaxCategory.TAX_EXEMPT,
        creditAccount: AccountTitle.CASH,
        creditAmount: 4400,
        creditTax: TaxCategory.TAX_EXEMPT,
        client: "Daiso",
        paymentDate: "2025-04-15",
        paymentAccount: "現金",
        notes: "Office cleaning supplies",
    },
];

async function main(): Promise<void> {
    console.log('Start seeding...');

    for (const entry of seedEntries) {
        const newEntry = await prisma.journalEntry.create({
            data: entry
        });
        console.log(`[${newEntry.id}]Created entry: ${newEntry.client}`);
    }

    console.log('Seeding finished.');

    // Optionally log how many entries now exist
    const total = await prisma.journalEntry.count();
    console.log(`Seeded JournalEntry records. Total count: ${total}`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });


