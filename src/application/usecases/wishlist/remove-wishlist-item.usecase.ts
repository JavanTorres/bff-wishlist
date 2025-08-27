import { Injectable, Inject, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class RemoveWishlistItemUseCase {
  private readonly logger = new Logger(RemoveWishlistItemUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, wishlistUuid: string, productUuid: string): Promise<Wishlist> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validateMultiple([
        { uuid: wishlistUuid, fieldName: 'UUID da wishlist' },
        { uuid: productUuid, fieldName: 'UUID do produto' }
      ]);

      const wishlist = await this.wishlistGateway.removeItem(token, wishlistUuid, productUuid);
      
      if (!wishlist) {
        throw new NotFoundException('Wishlist não encontrada');
      }
      
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao remover item ${productUuid} da wishlist ${wishlistUuid}:`, error.stack || error);
      
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new NotFoundException('Wishlist ou item não encontrado');
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
