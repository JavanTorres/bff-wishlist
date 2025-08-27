import { Injectable, Inject, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { UpdateWishlistInputDto } from '@presentation/dto/update-wishlist.dto';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class UpdateWishlistUseCase {
  private readonly logger = new Logger(UpdateWishlistUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, uuid: string, updateWishlistData: UpdateWishlistInputDto): Promise<Wishlist> {
    this.logger.log(`Atualizando wishlist ${uuid} para usuário`);

    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      UuidValidator.validate(uuid, 'UUID da wishlist');

      if (!updateWishlistData.name?.trim()) {
        throw new BadRequestException('Nome da lista é obrigatório');
      }

      if (updateWishlistData.items && updateWishlistData.items.length > 0) {
        UuidValidator.validateProductUuids(updateWishlistData.items);
      }

      const result = await this.wishlistGateway.update(token, uuid, updateWishlistData);
      this.logger.log(`Wishlist ${uuid} atualizada com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao atualizar wishlist ${uuid}:`, error.message);
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
