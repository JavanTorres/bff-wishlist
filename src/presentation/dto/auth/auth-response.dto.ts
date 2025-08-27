import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('AuthResponse', { description: 'Resposta da autenticação do usuário' })
export class AuthResponseDto {
  @Field({ description: 'Token de acesso JWT para autenticação' })
  accessToken: string;

  @Field({ description: 'Token de renovação para obter novos tokens de acesso' })
  refreshToken: string;
}
