import { Injectable, Inject, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { AuthGatewayPort } from '@application/ports/auth-gateway.port';
import { AuthResponse } from '@domain/entities/auth.entity';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject('AuthGatewayPort')
    private readonly authGateway: AuthGatewayPort,
  ) {}

  async execute(username: string, password: string): Promise<AuthResponse> {
    try {
      if (!username?.trim()) {
        throw new BadRequestException('Nome de usuário é obrigatório');
      }

      if (!password?.trim()) {
        throw new BadRequestException('Senha é obrigatória');
      }

      if (password.length < 6) {
        throw new BadRequestException('Senha deve ter pelo menos 6 caracteres');
      }

      const authResponse = await this.authGateway.login(username, password);
      
      this.logger.log(`Login realizado com sucesso para usuário: ${username}`);
      return authResponse;
    } catch (error) {
      this.logger.error(`Erro ao realizar login para usuário ${username}:`, error.stack || error);
      
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      
      if (error.message?.includes('400') || error.message?.includes('Bad Request')) {
        throw new BadRequestException('Dados de login inválidos');
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
