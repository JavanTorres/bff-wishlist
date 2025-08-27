import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { AddWishlistItemUseCase } from '@application/usecases/wishlist/add-wishlist-item.usecase';
import { CheckWishlistItemUseCase } from '@application/usecases/wishlist/check-wishlist-item.usecase';
import { CreateWishlistUseCase } from '@application/usecases/wishlist/create-wishlist.usecase';
import { DeleteWishlistUseCase } from '@application/usecases/wishlist/delete-wishlist.usecase';
import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlists.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { FindWishlistItemsUseCase } from '@application/usecases/wishlist/find-wishlist-items.usecase';
import { RemoveWishlistItemUseCase } from '@application/usecases/wishlist/remove-wishlist-item.usecase';
import { UpdateWishlistUseCase } from '@application/usecases/wishlist/update-wishlist.usecase';
import { AuthHelper } from '@infrastructure/helpers/auth.helper';
import { AddWishlistItemInputDto } from '@presentation/dto/add-wishlist-item.dto';
import { CheckWishlistItemDto } from '@presentation/dto/check-wishlist-item.dto';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';
import { FindWishlistItemsDto } from '@presentation/dto/find-wishlist-items.dto';
import { UpdateWishlistInputDto } from '@presentation/dto/update-wishlist.dto';
import { WishlistDto } from '@presentation/dto/wishlist.dto';

@Resolver(() => WishlistDto)
export class WishlistResolver {
  constructor(
    private readonly findAllWishlistsUseCase: FindAllWishlistsUseCase,
    private readonly findWishlistByIdUseCase: FindWishlistByIdUseCase,
    private readonly createWishlistUseCase: CreateWishlistUseCase,
    private readonly deleteWishlistUseCase: DeleteWishlistUseCase,
    private readonly updateWishlistUseCase: UpdateWishlistUseCase,
    private readonly addWishlistItemUseCase: AddWishlistItemUseCase,
    private readonly checkWishlistItemUseCase: CheckWishlistItemUseCase,
    private readonly findWishlistItemsUseCase: FindWishlistItemsUseCase,
    private readonly removeWishlistItemUseCase: RemoveWishlistItemUseCase,
  ) {}

  @Query(() => [WishlistDto], { 
    name: 'wishlists',
    description: 'Busca todas as listas de desejos do usuário autenticado'
  })
  async wishlists(@Context() context): Promise<WishlistDto[]> {
    const token = AuthHelper.extractToken(context);
    const result = await this.findAllWishlistsUseCase.execute(token);
    return plainToInstance(WishlistDto, result);
  }

  @Query(() => WishlistDto, { 
    name: 'wishlist',
    description: 'Busca uma lista de desejos específica pelo UUID'
  })
  async findById(
    @Args('uuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos a ser buscada'
    }) uuid: string, 
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.findWishlistByIdUseCase.execute(token, uuid);
    return plainToInstance(WishlistDto, result);
  }

  @Mutation(() => WishlistDto, {
    name: 'createWishlist',
    description: 'Cria uma nova lista de desejos para o usuário autenticado'
  })
  async createWishlist(
    @Args('input', { 
      type: () => CreateWishlistInputDto,
      description: 'Dados para criação da lista de desejos'
    }) input: CreateWishlistInputDto,
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.createWishlistUseCase.execute(token, input);
    return plainToInstance(WishlistDto, result);
  }

  @Mutation(() => WishlistDto, {
    name: 'updateWishlist',
    description: 'Atualiza uma lista de desejos existente'
  })
  async updateWishlist(
    @Args('uuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos a ser atualizada'
    }) uuid: string,
    @Args('input', { 
      type: () => UpdateWishlistInputDto,
      description: 'Dados para atualização da lista de desejos'
    }) input: UpdateWishlistInputDto,
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.updateWishlistUseCase.execute(token, uuid, input);
    return plainToInstance(WishlistDto, result);
  }

  @Mutation(() => Boolean, {
    name: 'deleteWishlist',
    description: 'Deleta uma lista de desejos pelo UUID'
  })
  async deleteWishlist(
    @Args('uuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos a ser deletada'
    }) uuid: string,
    @Context() context
  ): Promise<boolean> {
    const token = AuthHelper.extractToken(context);
    await this.deleteWishlistUseCase.execute(token, uuid);
    return true;
  }

  @Query(() => CheckWishlistItemDto, {
    name: 'checkWishlistItem',
    description: 'Verifica se um produto está na lista de desejos'
  })
  async checkWishlistItem(
    @Args('wishlistUuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos'
    }) wishlistUuid: string,
    @Args('productUuid', { 
      type: () => ID,
      description: 'UUID do produto a ser verificado'
    }) productUuid: string,
    @Context() context
  ): Promise<CheckWishlistItemDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.checkWishlistItemUseCase.execute(token, wishlistUuid, productUuid);
    
    // Transformar manualmente os campos de data se existirem
    if (result.item) {
      const transformedItem = {
        ...result.item,
        addedAt: result.item.addedAt ? new Date(result.item.addedAt) : undefined,
      };
      
      return {
        exists: result.exists,
        item: transformedItem
      };
    }
    
    return result;
  }

  @Query(() => FindWishlistItemsDto, {
    name: 'findWishlistItems',
    description: 'Consulta todos os produtos da wishlist do cliente'
  })
  async findWishlistItems(
    @Args('wishlistUuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos'
    }) wishlistUuid: string,
    @Context() context
  ): Promise<FindWishlistItemsDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.findWishlistItemsUseCase.execute(token, wishlistUuid);
    
    // Transformar manualmente os campos de data se existirem
    if (result.items && result.items.length > 0) {
      const transformedItems = result.items.map(item => ({
        ...item,
        addedAt: item.addedAt ? new Date(item.addedAt) : undefined,
      }));
      
      return {
        ...result,
        items: transformedItems
      };
    }
    
    return result;
  }

  @Mutation(() => WishlistDto, {
    name: 'addWishlistItem',
    description: 'Adiciona um item à lista de desejos'
  })
  async addWishlistItem(
    @Args('wishlistUuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos'
    }) wishlistUuid: string,
    @Args('input', { 
      type: () => AddWishlistItemInputDto,
      description: 'Dados do item a ser adicionado'
    }) input: AddWishlistItemInputDto,
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.addWishlistItemUseCase.execute(token, wishlistUuid, input);
    return plainToInstance(WishlistDto, result);
  }

  @Mutation(() => WishlistDto, {
    name: 'removeWishlistItem',
    description: 'Remove um item da lista de desejos'
  })
  async removeWishlistItem(
    @Args('wishlistUuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos'
    }) wishlistUuid: string,
    @Args('productUuid', { 
      type: () => ID,
      description: 'UUID do produto a ser removido'
    }) productUuid: string,
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.removeWishlistItemUseCase.execute(token, wishlistUuid, productUuid);
    return plainToInstance(WishlistDto, result);
  }
}