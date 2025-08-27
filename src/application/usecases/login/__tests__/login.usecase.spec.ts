import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGatewayPort } from '@application/ports/auth-gateway.port';
import { AuthResponse } from '@domain/entities/auth.entity';

import { LoginUseCase } from '../login.usecase';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authGateway: jest.Mocked<AuthGatewayPort>;

  const mockAuthResponse = new AuthResponse(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU1MDM2Mjc3fQ.HMaQUJ87e4gE4li7xZNygo7s0SbF__6WzvKJLhKXqKQ'
  );

  beforeEach(async () => {
    const mockAuthGateway = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: 'AuthGatewayPort',
          useValue: mockAuthGateway,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    authGateway = module.get('AuthGatewayPort');
  });

  describe('execute', () => {
    it('deve realizar login com sucesso quando credenciais válidas são fornecidas', async () => {
      const username = 'admin';
      const password = 'password123';
      authGateway.login.mockResolvedValue(mockAuthResponse);

      const result = await useCase.execute(username, password);

      expect(result).toEqual(mockAuthResponse);
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
      expect(authGateway.login).toHaveBeenCalledTimes(1);
    });

    it('deve lançar BadRequestException quando username está vazio', async () => {
      const username = '';
      const password = 'password123';

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Nome de usuário é obrigatório')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando username é null', async () => {
      const username = null as any;
      const password = 'password123';

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Nome de usuário é obrigatório')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando username contém apenas espaços', async () => {
      const username = '   ';
      const password = 'password123';

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Nome de usuário é obrigatório')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando password está vazio', async () => {
      const username = 'admin';
      const password = '';

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Senha é obrigatória')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando password é null', async () => {
      const username = 'admin';
      const password = null as any;

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Senha é obrigatória')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando password tem menos de 6 caracteres', async () => {
      const username = 'admin';
      const password = '12345';

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Senha deve ter pelo menos 6 caracteres')
      );
      expect(authGateway.login).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando gateway retorna erro 401', async () => {
      const username = 'admin';
      const password = 'wrongpassword';
      const gatewayError = new Error('401 Unauthorized');
      authGateway.login.mockRejectedValue(gatewayError);

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas')
      );
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
    });

    it('deve lançar UnauthorizedException quando gateway retorna erro com "Unauthorized"', async () => {
      const username = 'admin';
      const password = 'wrongpassword';
      const gatewayError = new Error('Unauthorized access');
      authGateway.login.mockRejectedValue(gatewayError);

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new UnauthorizedException('Credenciais inválidas')
      );
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
    });

    it('deve lançar BadRequestException quando gateway retorna erro 400', async () => {
      const username = 'admin';
      const password = 'password123';
      const gatewayError = new Error('400 Bad Request');
      authGateway.login.mockRejectedValue(gatewayError);

      await expect(useCase.execute(username, password)).rejects.toThrow(
        new BadRequestException('Dados de login inválidos')
      );
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
    });

    it('deve aceitar password com exatamente 6 caracteres', async () => {
      const username = 'admin';
      const password = '123456';
      authGateway.login.mockResolvedValue(mockAuthResponse);

      const result = await useCase.execute(username, password);

      expect(result).toEqual(mockAuthResponse);
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
    });

    it('deve aceitar password com mais de 6 caracteres', async () => {
      const username = 'admin';
      const password = 'password123456';
      authGateway.login.mockResolvedValue(mockAuthResponse);

      const result = await useCase.execute(username, password);

      expect(result).toEqual(mockAuthResponse);
      expect(authGateway.login).toHaveBeenCalledWith(username, password);
    });
  });
});
