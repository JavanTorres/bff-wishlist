import { UnauthorizedException } from '@nestjs/common';

export class AuthHelper {
  /**
   * Extrai o token de autorização do contexto GraphQL
   * @param context - O contexto de execução GraphQL
   * @returns O token de autorização
   * @throws UnauthorizedException se o token não estiver presente
   */
  static extractToken(context: any): string {
    const token = context.req?.headers?.authorization;
    
    if (!token) {
      throw new UnauthorizedException('Token de autorização é obrigatório');
    }

    return token;
  }

  /**
   * Extrai o token bearer (remove o prefixo 'Bearer ' se presente)
   * @param context - O contexto de execução GraphQL
   * @returns O token bearer limpo
   * @throws UnauthorizedException se o token não estiver presente
   */
  static extractBearerToken(context: any): string {
    const token = this.extractToken(context);
    
    if (token.startsWith('Bearer ')) {
      return token.substring(7);
    }
    
    return token;
  }
}
