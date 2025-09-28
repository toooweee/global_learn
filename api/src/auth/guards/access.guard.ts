import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { TokensService } from '../../tokens/tokens.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly tokensService: TokensService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = await this.tokensService.validateAccessToken(accessToken);

    if (!payload) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: { companyId: true },
    });

    if (!user) {
      throw new ForbiddenException('Пользователь не привязан к компании');
    }

    request.user = {
      ...payload,
      companyId: user.companyId || undefined,
    };

    return true;
  }
}
