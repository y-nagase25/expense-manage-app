-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "DebidAccountTitle" AS ENUM ('SALES', 'COMMUNICATION', 'SUPPLIES', 'RENT', 'UTILITIES', 'ADVERTISING', 'CASH', 'BANK_DEPOSIT', 'ACCOUNTS_RECEIVABLE');

-- CreateEnum
CREATE TYPE "CreditAccountTitle" AS ENUM ('CASH', 'BANK_DEPOSIT', 'CREDIT_CARD', 'OWNERS_DEBID', 'OWNERS_CREDIT');

-- CreateEnum
CREATE TYPE "TaxCategory" AS ENUM ('TAXABLE_10', 'TAXABLE_8', 'NON_TAXABLE', 'TAX_EXEMPT');

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "occurrenceDate" TEXT NOT NULL,
    "debitAccount" "DebidAccountTitle" NOT NULL,
    "debitAmount" INTEGER NOT NULL,
    "debitTax" "TaxCategory" NOT NULL,
    "creditAccount" "CreditAccountTitle" NOT NULL,
    "creditAmount" INTEGER NOT NULL,
    "creditTax" "TaxCategory" NOT NULL,
    "client" TEXT NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "paymentAccount" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);
