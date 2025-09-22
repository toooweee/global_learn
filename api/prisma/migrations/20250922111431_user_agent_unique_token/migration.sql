/*
  Warnings:

  - A unique constraint covering the columns `[token,user_agent]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_user_agent_key" ON "public"."tokens"("token", "user_agent");
