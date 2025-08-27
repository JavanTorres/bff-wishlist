import { Injectable, Inject, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { AddWishlistItemInputDto } from '@presentation/dto/add-wishlist-item.dto';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class AddWishlistItemUseCase {
  private readonly logger = new Logger(AddWishlistItemUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, wishlistUuid: string, itemData: AddWishlistItemInputDto): Promise<Wishlist> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validate(wishlistUuid, 'UUID da wishlist');

      UuidValidator.validate(itemData.productUuid, 'UUID do produto');

      const wishlist = await this.wishlistGateway.addItem(token, wishlistUuid, itemData);
      
      if (!wishlist) {
        throw new NotFoundException('Wishlist não encontrada');
      }
      
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao adicionar item ${itemData.productUuid} à wishlist ${wishlistUuid}:`, error.stack || error);
      
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new NotFoundException('Wishlist não encontrada');
      }
      
      if (error.message?.includes('conflict') || error.message?.includes('409')) {
        throw new NotFoundException('Item já existe na wishlist');
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
