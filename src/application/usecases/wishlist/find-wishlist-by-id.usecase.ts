import { Injectable, Inject, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';

@Injectable()
export class FindWishlistByIdUseCase {
  private readonly logger = new Logger(FindWishlistByIdUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, uuid: string): Promise<Wishlist> {
    try {
      // Validação de token
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      // Validação de UUID
      UuidValidator.validate(uuid, 'UUID');

      const wishlist = await this.wishlistGateway.findById(token, uuid);
      
      if (!wishlist) {
        throw new NotFoundException('Wishlist não encontrada');
      }
      
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao buscar wishlist ${uuid}:`, error.stack || error);
      
      // Tratamento específico para erros do gateway
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new NotFoundException(`Wishlist com UUID ${uuid} não foi encontrada`);
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
