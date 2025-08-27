import { Field, InputType, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';

@InputType()
export class UpdateWishlistItemInputDto {
  @Field(() => ID, { description: 'UUID do produto' })
  @IsString({ message: 'UUID do produto deve ser uma string' })
  @IsNotEmpty({ message: 'UUID do produto é obrigatório' })
  productUuid: string;

  @Field({ nullable: true, description: 'Observações sobre o item' })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}

@InputType()
export class UpdateWishlistInputDto {
  @Field({ description: 'Nome da lista de desejos' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @Field(() => [UpdateWishlistItemInputDto], { description: 'Lista de itens da wishlist' })
  @IsArray({ message: 'Items deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateWishlistItemInputDto)
  items: UpdateWishlistItemInputDto[];
}
