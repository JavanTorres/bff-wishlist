import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { LoginUseCase } from '@application/usecases/login/login.usecase';
import { AuthResponseDto } from '@presentation/dto/auth/auth-response.dto';
import { LoginInputDto } from '@presentation/dto/auth/login-input.dto';

@Resolver(() => AuthResponseDto)
export class AuthResolver {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Mutation(() => AuthResponseDto, {
    name: 'login',
    description: 'Realiza a autenticação do usuário e retorna os tokens de acesso'
  })
  async login(
    @Args('input', {
      description: 'Dados de login do usuário'
    }) input: LoginInputDto
  ): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(input.username, input.password);
    return plainToInstance(AuthResponseDto, result);
  }
}
