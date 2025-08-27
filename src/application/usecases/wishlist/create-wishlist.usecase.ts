import { Injectable, Inject, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';
import { UuidValidator } from '@shared/helpers/uuid-validator.helper';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class CreateWishlistUseCase {
  private readonly logger = new Logger(CreateWishlistUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, createWishlistData: CreateWishlistInputDto): Promise<Wishlist> {
    try {
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      if (!createWishlistData.name?.trim()) {
        throw new BadRequestException('Nome da lista é obrigatório');
      }

      if (createWishlistData.items) {
        UuidValidator.validateProductUuids(createWishlistData.items);
      }

      const wishlist = await this.wishlistGateway.create(token, createWishlistData);
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao criar wishlist ${createWishlistData.name}:`, error.stack || error);
      
      if (error.message?.includes('Conflict') || error.message?.includes('409')) {
        throw new BadRequestException('Já existe uma wishlist com este nome');
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
