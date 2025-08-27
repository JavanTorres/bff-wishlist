import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType('AddWishlistItemInput', { description: 'Dados para adicionar um item à lista de desejos' })
export class AddWishlistItemInputDto {
  @Field({ description: 'UUID do produto a ser adicionado' })
  @IsUUID(4, { message: 'productUuid deve ser um UUID válido' })
  @IsNotEmpty({ message: 'productUuid é obrigatório' })
  productUuid: string;

  @Field({ nullable: true, description: 'Observações sobre o item' })
  @IsOptional()
  @IsString({ message: 'notes deve ser uma string' })
  notes?: string;
}
