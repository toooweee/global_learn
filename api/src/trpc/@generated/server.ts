import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  usersRouter: t.router({
    createUser: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string(),
    })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAllUsers: publicProcedure.output(z.array(z.object({
      id: z.string().uuid(),
      email: z.string(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findUser: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      id: z.string(),
      data: z.object({
        email: z.string().email(),
        password: z.string(),
      }).partial(),
    })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteUser: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

