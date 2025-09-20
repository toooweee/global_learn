/*
  Warnings:

  - A unique constraint covering the columns `[register_request_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `register_request_id` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."permissions" AS ENUM ('CREATE_COURSE', 'READ_COURSE', 'REQUEST_COURSE_ACCESS', 'UPDATE_COURSE', 'DELETE_COURSE', 'CREATE_DEPARTMENT', 'DELETE_DEPARTMENT', 'UPDATE_DEPARTMENT', 'READ_DEPARTMENT', 'CREATE_POSITION', 'DELETE_POSITION', 'UPDATE_POSITION', 'READ_POSITION', 'CREATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'READ_EMPLOYEE');

-- CreateEnum
CREATE TYPE "public"."register_request_statuses" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."company_status" AS ENUM ('TRIAL', 'ACTIVE');

-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "direction_id" TEXT NOT NULL,
ADD COLUMN     "register_request_id" TEXT NOT NULL,
ADD COLUMN     "status" "public"."company_status" NOT NULL DEFAULT 'TRIAL';

-- AlterTable
ALTER TABLE "public"."positions" ADD COLUMN     "permissions" "public"."permissions"[];

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "extraPermissions" "public"."permissions"[];

-- CreateTable
CREATE TABLE "public"."register_requests" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "public"."register_request_statuses" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "register_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."directions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "register_requests_email_key" ON "public"."register_requests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "directions_name_key" ON "public"."directions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_register_request_id_key" ON "public"."companies"("register_request_id");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_register_request_id_fkey" FOREIGN KEY ("register_request_id") REFERENCES "public"."register_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_direction_id_fkey" FOREIGN KEY ("direction_id") REFERENCES "public"."directions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
