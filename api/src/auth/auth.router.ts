import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { LoginDto, LoginResponse, LoginSchema } from './auth.schema';
import { AuthService } from './auth.service';

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

  @Query()
  async refresh() {
    return this.authService.refresh();
  }

  @Query()
  async logout() {
    return this.authService.logout();
  }
}
