import * as z from 'zod';
import { createZodDto } from 'nestjs-zod';

const UserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export class CreateUserDto extends createZodDto(UserSchema) {}

export class UpdateUserDto extends createZodDto(UserSchema.partial()) {}
