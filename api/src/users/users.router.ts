import { Input, Mutation, Router } from 'nestjs-trpc';
import { UsersService } from './users.service';
import { CreateUserDto, UserInputSchema, UserOutputSchema } from './user.schema';

@Router({ alias: 'users' })
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({
    input: UserInputSchema,
    output: UserOutputSchema,
  })
  async createUser(@Input() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
