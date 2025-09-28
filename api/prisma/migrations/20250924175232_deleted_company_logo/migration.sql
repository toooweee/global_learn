/*
  Warnings:

  - You are about to drop the column `company_id` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."files" DROP CONSTRAINT "files_company_id_fkey";

-- DropIndex
DROP INDEX "public"."files_company_id_key";

-- AlterTable
ALTER TABLE "public"."files" DROP COLUMN "company_id";
