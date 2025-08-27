import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ObjectType('WishlistItem', { description: 'Item de uma lista de desejos' })
export class WishlistItemDto {
  @Field({ description: 'UUID do produto' })
  productUuid: string;

  @Type(() => Date)
  @Field({ description: 'Data em que o item foi adicionado à lista' })
  addedAt: Date;

  @Field({ nullable: true, description: 'Observações sobre o item' })
  notes?: string;
}

@ObjectType('Wishlist', { description: 'Lista de desejos do usuário' })
export class WishlistDto {
  @Field(() => ID, { description: 'UUID único da lista de desejos' })
  uuid: string;

  @Field({ description: 'UUID do usuário proprietário da lista' })
  userUuid: string;

  @Field({ description: 'Nome da lista de desejos' })
  name: string;

  @Type(() => WishlistItemDto)
  @Field(() => [WishlistItemDto], { description: 'Itens da lista de desejos' })
  items: WishlistItemDto[];

  @Type(() => Date)
  @Field({ description: 'Data de criação da lista' })
  createdAt: Date;

  @Type(() => Date)
  @Field({ description: 'Data de última atualização da lista' })
  updatedAt: Date;
}