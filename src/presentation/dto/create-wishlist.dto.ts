import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType('CreateWishlistItemInput', { description: 'Dados para criar um item na lista de desejos' })
export class CreateWishlistItemInputDto {
  @Field({ description: 'UUID do produto' })
  @IsUUID(4, { message: 'productUuid deve ser um UUID válido' })
  @IsNotEmpty({ message: 'productUuid é obrigatório' })
  productUuid: string;

  @Field({ nullable: true, description: 'Observações sobre o item' })
  @IsOptional()
  @IsString({ message: 'notes deve ser uma string' })
  notes?: string;
}

@InputType('CreateWishlistInput', { description: 'Dados para criar uma nova lista de desejos' })
export class CreateWishlistInputDto {
  @Field({ description: 'Nome da lista de desejos' })
  @IsString({ message: 'name deve ser uma string' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;

  @Field(() => [CreateWishlistItemInputDto], { 
    description: 'Itens para adicionar à lista de desejos',
    defaultValue: []
  })
  @IsOptional()
  items?: CreateWishlistItemInputDto[];
}
