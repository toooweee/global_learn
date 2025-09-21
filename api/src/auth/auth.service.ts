import { Injectable } from '@nestjs/common';
import { LoginDto } from './auth.schema';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    console.log(loginDto);
    return {
      accessToken: 'token',
    };
  }
}
