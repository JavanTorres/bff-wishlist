import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpMethodEnum } from '@application/enums/http-method.enum';
import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { AddWishlistItemInputDto } from '@presentation/dto/add-wishlist-item.dto';
import { CheckWishlistItemDto } from '@presentation/dto/check-wishlist-item.dto';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';
import { FindWishlistItemsDto } from '@presentation/dto/find-wishlist-items.dto';
import { UpdateWishlistInputDto } from '@presentation/dto/update-wishlist.dto';

import { HttpBffGateway } from './http.gateway';

@Injectable()
export class WishlistGateway extends HttpBffGateway implements WishlistGatewayPort {
  private readonly apiUrl: string;

  constructor(
    httpService: HttpService,
    private configService: ConfigService,
  ) {
    super(httpService);
    this.apiUrl = this.configService.get<string>('API_WISHLIST_URL') as string ;
  }

  async findAll(token: string): Promise<Wishlist[]> {
    const response = await this.gatewayHandler(
      '/wishlists',
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async findById(token, uuid: string): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/wishlists/${uuid}`,
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async create(token: string, createWishlistData: CreateWishlistInputDto): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      '/wishlists',
      HttpMethodEnum.POST,
      createWishlistData,
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async update(token: string, uuid: string, updateWishlistData: UpdateWishlistInputDto): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/wishlists/${uuid}`,
      HttpMethodEnum.PUT,
      updateWishlistData,
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async delete(token: string, uuid: string): Promise<void> {
    await this.gatewayHandler(
      `/wishlists/${uuid}`,
      HttpMethodEnum.DELETE,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
  }

  async removeItem(token: string, wishlistUuid: string, productUuid: string): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/wishlists/${wishlistUuid}/items/${productUuid}`,
      HttpMethodEnum.DELETE,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async addItem(token: string, wishlistUuid: string, itemData: AddWishlistItemInputDto): Promise<Wishlist> {
    const response = await this.gatewayHandler(
      `/wishlists/${wishlistUuid}/items`,
      HttpMethodEnum.POST,
      itemData,
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async checkItem(token: string, wishlistUuid: string, productUuid: string): Promise<CheckWishlistItemDto> {
    const response = await this.gatewayHandler(
      `/wishlists/${wishlistUuid}/items/${productUuid}`,
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }

  async findWishlistItems(token: string, wishlistUuid: string): Promise<FindWishlistItemsDto> {
    const response = await this.gatewayHandler(
      `/wishlists/${wishlistUuid}/items`,
      HttpMethodEnum.GET,
      {},
      this.apiUrl,
      { Authorization: token },
      false
    );
    return response;
  }
}