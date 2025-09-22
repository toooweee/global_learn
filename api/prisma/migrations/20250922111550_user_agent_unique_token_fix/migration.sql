/*
  Warnings:

  - A unique constraint covering the columns `[user_id,user_agent]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."tokens_token_user_agent_key";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_user_id_user_agent_key" ON "public"."tokens"("user_id", "user_agent");
