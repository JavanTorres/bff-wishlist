import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ObjectType({ description: 'Item da wishlist com detalhes completos' })
export class WishlistItemDetailsDto {
  @Field(() => String, { description: 'UUID do produto' })
  productUuid: string;

  @Field(() => Date, { nullable: true, description: 'Data quando o item foi adicionado' })
  @Type(() => Date)
  addedAt?: Date;

  @Field(() => String, { nullable: true, description: 'Notas sobre o produto' })
  notes?: string;
}

@ObjectType({ description: 'Resposta da consulta de todos os itens da wishlist' })
export class FindWishlistItemsDto {
  @Field(() => String, { description: 'UUID da wishlist' })
  uuid: string;

  @Field(() => [WishlistItemDetailsDto], { description: 'Lista de itens da wishlist' })
  items: WishlistItemDetailsDto[];

  @Field(() => Int, { description: 'Total de itens na wishlist' })
  totalItems: number;

  @Field(() => Int, { description: 'Slots restantes na wishlist' })
  remainingSlots: number;
}
