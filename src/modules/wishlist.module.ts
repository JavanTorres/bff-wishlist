import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AddWishlistItemUseCase } from '@application/usecases/wishlist/add-wishlist-item.usecase';
import { CheckWishlistItemUseCase } from '@application/usecases/wishlist/check-wishlist-item.usecase';
import { CreateWishlistUseCase } from '@application/usecases/wishlist/create-wishlist.usecase';
import { DeleteWishlistUseCase } from '@application/usecases/wishlist/delete-wishlist.usecase';
import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlists.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { FindWishlistItemsUseCase } from '@application/usecases/wishlist/find-wishlist-items.usecase';
import { RemoveWishlistItemUseCase } from '@application/usecases/wishlist/remove-wishlist-item.usecase';
import { UpdateWishlistUseCase } from '@application/usecases/wishlist/update-wishlist.usecase';
import { WishlistGateway } from '@infrastructure/gateways/wishlist.gateway';
import { WishlistResolver } from '@presentation/resolvers/wishlist.resolver';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    WishlistResolver,
    AddWishlistItemUseCase,
    CheckWishlistItemUseCase,
    CreateWishlistUseCase,
    DeleteWishlistUseCase,
    FindAllWishlistsUseCase,
    FindWishlistByIdUseCase,
    FindWishlistItemsUseCase,
    RemoveWishlistItemUseCase,
    UpdateWishlistUseCase,
    {
      provide: 'WishlistGatewayPort',
      useClass: WishlistGateway,
    },
  ],
})
export class WishlistModule {}