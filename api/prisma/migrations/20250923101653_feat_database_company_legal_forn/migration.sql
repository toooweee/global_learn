/*
  Warnings:

  - Added the required column `company_legal_form_id` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "company_legal_form_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_company_legal_form_id_fkey" FOREIGN KEY ("company_legal_form_id") REFERENCES "public"."company_legal_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
