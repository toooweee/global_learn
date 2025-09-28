import { Global, Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { AppContext } from './app.context';
import { TrpcPanelController } from './trpc-panel.controller';

@Global()
@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: 'src/trpc/@generated',
      context: AppContext,
    }),
  ],
  controllers: [TrpcPanelController],
  providers: [AppContext],
})
export class TrpcModule {}
