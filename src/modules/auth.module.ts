import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoginUseCase } from '@application/usecases/login/login.usecase';
import { AuthGateway } from '@infrastructure/gateways/auth.gateway';
import { AuthResolver } from '@presentation/resolvers/auth.resolver';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    AuthResolver,
    LoginUseCase,
    {
      provide: 'AuthGatewayPort',
      useClass: AuthGateway,
    },
  ],
})
export class AuthModule {}
