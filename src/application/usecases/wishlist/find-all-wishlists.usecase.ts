import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class FindAllWishlistsUseCase {
  private readonly logger = new Logger(FindAllWishlistsUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string): Promise<Wishlist[]> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      const wishlists = await this.wishlistGateway.findAll(token);
      return wishlists;
    } catch (error) {
      this.logger.error('Erro ao buscar todas as wishlists:', error.stack || error);
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
