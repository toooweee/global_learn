import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  users: t.router({
    createUser: publicProcedure.input(z.object({
      email: z.email(),
      password: z.string(),
    })).output(z.object({
      id: z.uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

