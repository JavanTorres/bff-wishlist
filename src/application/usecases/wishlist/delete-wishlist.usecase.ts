import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class DeleteWishlistUseCase {
  private readonly logger = new Logger(DeleteWishlistUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, wishlistUuid: string): Promise<void> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validate(wishlistUuid, 'UUID da wishlist');

      await this.wishlistGateway.delete(token, wishlistUuid);
      
      this.logger.log(`Wishlist ${wishlistUuid} deletada com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao deletar wishlist ${wishlistUuid}:`, error.stack || error);

      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
