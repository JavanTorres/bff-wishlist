
import { Wishlist } from '@domain/entities/wishlist.entity';
import { AddWishlistItemInputDto } from '@presentation/dto/add-wishlist-item.dto';
import { CheckWishlistItemDto } from '@presentation/dto/check-wishlist-item.dto';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';
import { FindWishlistItemsDto } from '@presentation/dto/find-wishlist-items.dto';
import { UpdateWishlistInputDto } from '@presentation/dto/update-wishlist.dto';


export abstract class WishlistGatewayPort {
  abstract findAll(token: string): Promise<Wishlist[]>;
  abstract findById(token: string, uuid: string): Promise<Wishlist>;
  abstract create(token: string, createWishlistData: CreateWishlistInputDto): Promise<Wishlist>;
  abstract update(token: string, uuid: string, updateWishlistData: UpdateWishlistInputDto): Promise<Wishlist>;
  abstract delete(token: string, uuid: string): Promise<void>;
  abstract removeItem(token: string, wishlistUuid: string, productUuid: string): Promise<Wishlist>;
  abstract addItem(token: string, wishlistUuid: string, itemData: AddWishlistItemInputDto): Promise<Wishlist>;
  abstract checkItem(token: string, wishlistUuid: string, productUuid: string): Promise<CheckWishlistItemDto>;
  abstract findWishlistItems(token: string, wishlistUuid: string): Promise<FindWishlistItemsDto>;
}
