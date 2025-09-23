import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  usersRouter: t.router({
    createUser: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string(),
      role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
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
    updateUser: publicProcedure.input(z.object({
      id: z.string(),
      data: z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
      }).partial(),
    })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteUser: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  authRouter: t.router({
    login: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })).output(z.object({
      accessToken: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    refresh: publicProcedure.output(z.object({
      accessToken: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.output(z.object({
      success: z.boolean(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  registerRequestsRouter: t.router({
    createRegisterRequest: publicProcedure.input(z.object({
      email: z.string().email(),
      phone: z.string(),
    })).output(z.object({
      id: z.string(),
      email: z.string().email(),
      phone: z.string(),
      status: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAllRegisterRequests: publicProcedure.output(z.array(z.object({
      id: z.string(),
      email: z.string(),
      phone: z.string(),
      status: z.string(),
      createdAt: z.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateRegisterRequestStatus: publicProcedure.input(z.object({
      id: z.string(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    })).output(z.object({
      id: z.string(),
      email: z.string(),
      phone: z.string(),
      status: z.string(),
      createdAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    completeRegistration: publicProcedure.input(z.object({
      token: z.string(),
      user: z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
      }),
      company: z.object({
        name: z.string(),
        description: z.string(),
        directions: z.string().array(),
        address: z.string(),
        foundationDate: z.string(),
        registerRequestId: z.string(),
        companyLegalFormId: z.string(),
      }),
    })).output(z.object({
      userId: z.string(),
      companyId: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

