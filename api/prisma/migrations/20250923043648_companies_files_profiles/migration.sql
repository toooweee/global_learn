/*
  Warnings:

  - You are about to drop the column `direction_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `positions` table. All the data in the column will be lost.
  - You are about to drop the column `extraPermissions` on the `users` table. All the data in the column will be lost.
  - Added the required column `address` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foundation_date` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."roles" ADD VALUE 'CLIENT_ADMIN';

-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_direction_id_fkey";

-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "direction_id",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "foundation_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."positions" DROP COLUMN "permissions";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "extraPermissions";

-- DropEnum
DROP TYPE "public"."permissions";

-- CreateTable
CREATE TABLE "public"."users_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "bio" TEXT,
    "employment_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_legal_forms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_legal_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies_directions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "direction_id" TEXT NOT NULL,

    CONSTRAINT "companies_directions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_profile_id" TEXT,
    "company_id" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_profiles_user_id_key" ON "public"."users_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_legal_forms_name_key" ON "public"."company_legal_forms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "files_company_id_key" ON "public"."files"("company_id");

-- AddForeignKey
ALTER TABLE "public"."users_profiles" ADD CONSTRAINT "users_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies_directions" ADD CONSTRAINT "companies_directions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies_directions" ADD CONSTRAINT "companies_directions_direction_id_fkey" FOREIGN KEY ("direction_id") REFERENCES "public"."directions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "public"."users_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
