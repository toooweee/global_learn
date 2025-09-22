import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc';
import { UsersService } from './users.service';
import { CreateUserDto, UserInputSchema, UserOutputSchema } from './user.schema';
import { z } from 'zod';
import { AccessMiddleware } from '../auth/middleware';

@Router()
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({
    input: UserInputSchema,
    output: UserOutputSchema,
  })
  async createUser(@Input() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Query({
    output: z.array(UserOutputSchema),
  })
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @UseMiddlewares(AccessMiddleware)
  @Query({
    input: z.object({ id: z.string() }),
    output: UserOutputSchema,
  })
  async findUser(@Input('id') id: string) {
    return this.usersService.findUser({ id });
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: z.object({
      id: z.string(),
      data: UserInputSchema.partial(),
    }),
    output: UserOutputSchema,
  })
  async updateUser(@Input('id') id: string, @Input() updateUserDto: Partial<CreateUserDto>) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseMiddlewares(AccessMiddleware)
  @Mutation({
    input: z.object({ id: z.string() }),
    output: UserOutputSchema,
  })
  async deleteUser(@Input('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
