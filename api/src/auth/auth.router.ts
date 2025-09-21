import { Input, Mutation, Router } from 'nestjs-trpc';
import { LoginDto, LoginResponse, LoginSchema } from './auth.schema';
import { AuthService } from './auth.service';

@Router()
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: LoginSchema,
    output: LoginResponse,
  })
  login(@Input() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
