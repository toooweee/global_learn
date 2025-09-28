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
    findUser: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateUser: publicProcedure.input(z.object({
      id: z.string().uuid(),
      data: z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
      }).partial(),
    })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteUser: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    me: publicProcedure.output(z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
      companyId: z.string().uuid().optional(),
      profile: z.object({
        id: z.string().uuid(),
        name: z.string(),
        surname: z.string(),
        bio: z.string().optional(),
        employmentDate: z.date(),
        avatar: z
          .object({
            id: z.string().uuid(),
            path: z.string(),
          })
          .optional(),
      }).optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createUserWithProfile: publicProcedure.input(z.object({
      email: z.string().email(),
      password: z.string(),
      role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']).optional(),
      name: z.string(),
      surname: z.string(),
      bio: z.string().optional(),
      employmentDate: z.coerce.date(),
      positionId: z.string().uuid().optional(),
    })).output(z.object({
      id: z.string().uuid(),
      email: z.string(),
      role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']),
      companyId: z.string().uuid(),
      profile: z.object({
        id: z.string().uuid(),
        name: z.string(),
        surname: z.string(),
        bio: z.string().optional(),
        employmentDate: z.date(),
        avatar: z
          .object({
            id: z.string().uuid(),
            path: z.string(),
          })
          .optional(),
      }),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAllUsers: publicProcedure.input(z.object({
      positionId: z.string().uuid().optional(),
    })).output(z.array(z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      role: z.enum(['ADMIN', 'USER', 'CLIENT_ADMIN']),
      companyId: z.string().uuid().optional(),
      positionId: z.string().uuid().optional(),
      profile: z.object({
        id: z.string().uuid(),
        name: z.string(),
        surname: z.string(),
        bio: z.string().optional(),
        employmentDate: z.date(),
      }).optional(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createProfile: publicProcedure.input(z.object({
      name: z.string(),
      surname: z.string(),
      bio: z.string().optional(),
      employmentDate: z.coerce.date(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      surname: z.string(),
      bio: z.string().optional(),
      employmentDate: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateProfile: publicProcedure.input(z.object({
      name: z.string().optional(),
      surname: z.string().optional(),
      bio: z.string().optional(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      surname: z.string(),
      bio: z.string().optional(),
      employmentDate: z.date(),
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
        foundationDate: z.coerce.date(),
        companyLegalFormId: z.string(),
      }),
    })).output(z.object({
      userId: z.string(),
      companyId: z.string(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  companiesRouter: t.router({
    findAll: publicProcedure.output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      address: z.string(),
      foundationDate: z.coerce.date(),
      status: z.enum(['ACTIVE', 'TRIAL']),
      registerRequestId: z.string(),
      companyLegalFormId: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      directions: z.array(z.string()),
      companyLegalForm: z.object({
        id: z.string(),
        name: z.string(),
      }),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  directionsRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string(),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findOne: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAll: publicProcedure.output(z.array(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({ id: z.string() }).merge(z.object({
      name: z.string(),
    }).partial())).output(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      name: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  legalFormsRouter: t.router({
    create: publicProcedure.input(z.object({
      name: z.string(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findOne: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAll: publicProcedure.output(z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    update: publicProcedure.input(z.object({
      id: z.string(),
      name: z.string().optional(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    delete: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.void()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  clientCompaniesRouter: t.router({
    findOneCompany: publicProcedure.input(z.object({ id: z.string().uuid() }).optional()).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      address: z.string(),
      foundationDate: z.string(),
      status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateCompany: publicProcedure.input(z.object({
      id: z.string().uuid(),
      name: z.string().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      foundationDate: z.string().optional(),
      companyLegalFormId: z.string().uuid().optional(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      address: z.string(),
      foundationDate: z.string(),
      status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED', 'CANCELLED']),
      createdAt: z.date(),
      updatedAt: z.date(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createDepartment: publicProcedure.input(z.object({
      name: z.string().min(1, 'Название департамента обязательно').max(100, 'Название не должно превышать 100 символов'),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      companyId: z.string().uuid(),
      positionsCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findOneDepartment: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      companyId: z.string().uuid(),
      positionsCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAllDepartments: publicProcedure.output(z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      companyId: z.string().uuid(),
      positionsCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateDepartment: publicProcedure.input(z.object({
      id: z.string().uuid('Недействительный ID департамента'),
      name: z
        .string()
        .min(1, 'Название департамента обязательно')
        .max(100, 'Название не должно превышать 100 символов')
        .optional(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      companyId: z.string().uuid(),
      positionsCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteDepartment: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.void()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createPosition: publicProcedure.input(z.object({
      name: z.string().min(1, 'Название позиции обязательно').max(100, 'Название не должно превышать 100 символов'),
      departmentId: z.string().uuid('Недействительный ID департамента'),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      departmentId: z.string().uuid(),
      department: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
      usersCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findOnePosition: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      departmentId: z.string().uuid(),
      department: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
      usersCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    findAllPositions: publicProcedure.output(z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      departmentId: z.string().uuid(),
      department: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
      usersCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updatePosition: publicProcedure.input(z.object({
      id: z.string().uuid('Недействительный ID позиции'),
      name: z
        .string()
        .min(1, 'Название позиции обязательно')
        .max(100, 'Название не должно превышать 100 символов')
        .optional(),
      departmentId: z.string().uuid('Недействительный ID департамента').optional(),
    })).output(z.object({
      id: z.string().uuid(),
      name: z.string(),
      departmentId: z.string().uuid(),
      department: z.object({ id: z.string().uuid(), name: z.string() }).optional(),
      usersCount: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deletePosition: publicProcedure.input(z.object({ id: z.string().uuid() })).output(z.void()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

