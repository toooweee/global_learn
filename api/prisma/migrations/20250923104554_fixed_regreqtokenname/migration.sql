/*
  Warnings:

  - You are about to drop the `register_requst_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."register_requst_tokens" DROP CONSTRAINT "register_requst_tokens_register_request_id_fkey";

-- DropTable
DROP TABLE "public"."register_requst_tokens";

-- CreateTable
CREATE TABLE "public"."register_request_tokens" (
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "register_request_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "register_request_tokens_token_key" ON "public"."register_request_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "register_request_tokens_register_request_id_key" ON "public"."register_request_tokens"("register_request_id");

-- AddForeignKey
ALTER TABLE "public"."register_request_tokens" ADD CONSTRAINT "register_request_tokens_register_request_id_fkey" FOREIGN KEY ("register_request_id") REFERENCES "public"."register_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
