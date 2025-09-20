-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_position_id_fkey";

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "position_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
