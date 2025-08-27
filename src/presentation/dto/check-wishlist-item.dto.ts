import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ObjectType({ description: 'Item encontrado na wishlist' })
export class WishlistItemDto {
  @Field(() => String, { description: 'UUID do produto' })
  productUuid: string;

  @Field(() => Date, { nullable: true, description: 'Data quando o item foi adicionado' })
  @Type(() => Date)
  addedAt?: Date;

  @Field(() => String, { nullable: true, description: 'Notas sobre o produto' })
  notes?: string;

  @Field(() => String, { nullable: true, description: 'ID interno do item' })
  _id?: string;
}

@ObjectType({ description: 'Resposta da verificação de existência de item na wishlist' })
export class CheckWishlistItemDto {
  @Field(() => Boolean, { description: 'Se o item existe na wishlist' })
  exists: boolean;

  @Field(() => WishlistItemDto, { nullable: true, description: 'Dados do item, se existir' })
  item?: WishlistItemDto;
}
