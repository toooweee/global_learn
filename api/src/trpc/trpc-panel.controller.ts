import { All, Controller, Inject } from '@nestjs/common';
import { AppRouterHost } from 'nestjs-trpc';
import { renderTrpcPanel } from 'trpc-ui';

@Controller()
export class TrpcPanelController {
  constructor(
    @Inject(AppRouterHost)
    private readonly appRouterHost: AppRouterHost,
  ) {}

  @All('panel')
  panel() {
    const appRouter = this.appRouterHost.appRouter;
    return renderTrpcPanel(appRouter, { url: 'http://localhost:3000/trpc' });
  }
}
