import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { UsersService } from './users.service';
import { CreateUserDto, UserInputSchema, UserOutputSchema } from './user.schema';
import { z } from 'zod';

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

  @Query({
    output: z.array(UserOutputSchema),
  })
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: UserOutputSchema,
  })
  async findUser(@Input('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: UserInputSchema.partial(),
    }),
    output: UserOutputSchema,
  })
  async update(@Input('id') id: string, @Input() updateUserDto: Partial<CreateUserDto>) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: UserOutputSchema,
  })
  async deleteUser(@Input('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
