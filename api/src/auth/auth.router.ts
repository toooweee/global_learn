import { Input, Mutation, Router } from 'nestjs-trpc';
import { LoginDto, LoginResponse, LoginSchema } from '@auth/auth.schema';
import { AuthService } from '@auth/auth.service';

@Router()
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: LoginSchema,
    output: LoginResponse,
  })
  async login(@Input() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
