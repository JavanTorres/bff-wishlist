import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { CheckWishlistItemDto } from '@presentation/dto/check-wishlist-item.dto';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class CheckWishlistItemUseCase {
  private readonly logger = new Logger(CheckWishlistItemUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, wishlistUuid: string, productUuid: string): Promise<CheckWishlistItemDto> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validateMultiple([
        { uuid: wishlistUuid, fieldName: 'UUID da wishlist' },
        { uuid: productUuid, fieldName: 'UUID do produto' }
      ]);

      const result = await this.wishlistGateway.checkItem(token, wishlistUuid, productUuid);
      
      return result;
    } catch (error) {
      this.logger.error(`Erro ao verificar item ${productUuid} na wishlist ${wishlistUuid}:`, error.stack || error);

      if (error.message?.includes('not found') || error.message?.includes('404') || error.message?.includes('não encontrada') || error.statusCode === 404) {
        return { exists: false };
      }

      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
