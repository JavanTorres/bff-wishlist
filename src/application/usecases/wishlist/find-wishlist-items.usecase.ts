import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { FindWishlistItemsDto } from '@presentation/dto/find-wishlist-items.dto';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class FindWishlistItemsUseCase {
  private readonly logger = new Logger(FindWishlistItemsUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, wishlistUuid: string): Promise<FindWishlistItemsDto> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validate(wishlistUuid, 'UUID da wishlist');

      const result = await this.wishlistGateway.findWishlistItems(token, wishlistUuid);
      
      return result;
    } catch (error) {
      this.logger.error(`Erro ao buscar itens da wishlist ${wishlistUuid}:`, error.stack || error);

      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
