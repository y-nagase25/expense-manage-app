/*
  Warnings:

  - You are about to drop the column `account_id` on the `journals` table. All the data in the column will be lost.
  - Added the required column `credit_account_id` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debit_account_id` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "journals" DROP CONSTRAINT "journals_account_id_fkey";

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "account_id",
ADD COLUMN     "credit_account_id" TEXT NOT NULL,
ADD COLUMN     "debit_account_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_debit_account_id_fkey" FOREIGN KEY ("debit_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_credit_account_id_fkey" FOREIGN KEY ("credit_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
