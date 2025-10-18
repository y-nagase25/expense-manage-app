-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "PaymentAccount" AS ENUM ('BANKING', 'CREDIT_CARD', 'CASH', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('BS', 'PL');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('TAXABLE_10', 'TAXABLE_8', 'TAX_FREE', 'NON_TAXABLE', 'TAX_EXEMPT', 'NONE');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "business_name" TEXT,
    "terms_accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journals" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "TransactionType" NOT NULL,
    "account_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "payment_account" "PaymentAccount" NOT NULL DEFAULT 'CASH',
    "tax_type" "TaxType" NOT NULL DEFAULT 'NONE',
    "client_name" TEXT NOT NULL,
    "description" VARCHAR(500),
    "sub_account" TEXT,
    "memo" TEXT,
    "fiscal_year" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_kana" TEXT,
    "category" "AccountCategory" NOT NULL,
    "sub_category" TEXT,
    "report_type" "ReportType" NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "default_tax_type" "TaxType" NOT NULL DEFAULT 'NONE',
    "is_display" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journals_user_id_date_idx" ON "journals"("user_id", "date");

-- CreateIndex
CREATE INDEX "journals_user_id_fiscal_year_idx" ON "journals"("user_id", "fiscal_year");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_code_key" ON "accounts"("code");

-- CreateIndex
CREATE INDEX "accounts_code_idx" ON "accounts"("code");

-- CreateIndex
CREATE INDEX "accounts_category_display_order_idx" ON "accounts"("category", "display_order");

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

