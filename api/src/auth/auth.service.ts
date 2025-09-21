import { Injectable } from '@nestjs/common';
import { LoginDto } from '@auth/auth.schema';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {}
}
