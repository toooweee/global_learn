import { Controller, Post, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AppContextType } from '../trpc/app.context.interface';
import { TRPCError } from '@trpc/server';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AccessGuard } from '../auth/guards/access.guard';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('upload-avatar')
  @UseGuards(AccessGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: path.join(process.cwd(), 'uploads', 'avatars'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No file uploaded' });
    }

    const userId = (req as AppContextType).user?.sub;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
    }

    const result = await this.usersService.uploadAvatar(userId, file);
    return { success: true, data: result };
  }
}
