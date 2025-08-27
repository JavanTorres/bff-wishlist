import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { AddWishlistItemInputDto } from '@presentation/dto/add-wishlist-item.dto';

import { AddWishlistItemUseCase } from '../add-wishlist-item.usecase';

describe('AddWishlistItemUseCase', () => {
  let useCase: AddWishlistItemUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlist: Wishlist = {
    uuid: '9aa8faec-e6cd-474d-939a-648b7a735649',
    userUuid: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Favoritos Games',
    items: [
      {
        productUuid: '550e8400-e29b-41d4-a716-446655440001',
        addedAt: new Date('2025-08-06T02:26:26.913Z'),
        notes: 'Produto desejado para o aniversário12',
      },
    ],
    createdAt: new Date('2025-08-06T01:47:20.339Z'),
    updatedAt: new Date('2025-08-06T01:47:20.339Z'),
  };

  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMDY1OCwiZXhwIjoxNzU0NDczODU4fQ.gVIehoY2UVd7h7Zj3wpRj2IMljEF0iZxUks0x7_eOaY';
  const validWishlistUuid = '9aa8faec-e6cd-474d-939a-648b7a735649';
  const validItemData: AddWishlistItemInputDto = {
    productUuid: '550e8400-e29b-41d4-a716-446655440001',
    notes: 'Produto desejado para o aniversário12',
  };

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      removeItem: jest.fn(),
      addItem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddWishlistItemUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<AddWishlistItemUseCase>(AddWishlistItemUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve adicionar item à wishlist quando dados válidos são fornecidos', async () => {
      wishlistGateway.addItem.mockResolvedValue(mockWishlist);

      const result = await useCase.execute(validToken, validWishlistUuid, validItemData);

      expect(result).toEqual(mockWishlist);
      expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validItemData);
      expect(wishlistGateway.addItem).toHaveBeenCalledTimes(1);
    });

    describe('Validação de token', () => {
      it('deve lançar UnauthorizedException quando token está vazio', async () => {
        const token = '';

        await expect(useCase.execute(token, validWishlistUuid, validItemData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é null', async () => {
        const token = null as any;

        await expect(useCase.execute(token, validWishlistUuid, validItemData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é undefined', async () => {
        const token = undefined as any;

        await expect(useCase.execute(token, validWishlistUuid, validItemData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
        const token = '   ';

        await expect(useCase.execute(token, validWishlistUuid, validItemData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID da wishlist', () => {
      it('deve lançar BadRequestException quando UUID da wishlist está vazio', async () => {
        const wishlistUuid = '';

        await expect(useCase.execute(validToken, wishlistUuid, validItemData)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist é null', async () => {
        const wishlistUuid = null as any;

        await expect(useCase.execute(validToken, wishlistUuid, validItemData)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist tem formato inválido', async () => {
        const wishlistUuid = 'invalid-uuid-format';

        await expect(useCase.execute(validToken, wishlistUuid, validItemData)).rejects.toThrow(
          new BadRequestException('UUID da wishlist deve ter um formato válido')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID do produto', () => {
      it('deve lançar BadRequestException quando UUID do produto está vazio', async () => {
        const itemData = { ...validItemData, productUuid: '' };

        await expect(useCase.execute(validToken, validWishlistUuid, itemData)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto tem formato inválido', async () => {
        const itemData = { ...validItemData, productUuid: 'invalid-uuid' };

        await expect(useCase.execute(validToken, validWishlistUuid, itemData)).rejects.toThrow(
          new BadRequestException('UUID do produto deve ter um formato válido')
        );
        expect(wishlistGateway.addItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de dados do item', () => {
      it('deve aceitar item sem notes', async () => {
        const itemData = { productUuid: validItemData.productUuid };
        wishlistGateway.addItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, itemData);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, itemData);
      });

      it('deve aceitar item com notes vazias', async () => {
        const itemData = { ...validItemData, notes: '' };
        wishlistGateway.addItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, itemData);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, itemData);
      });
    });

    describe('Cenários de erro do gateway', () => {
      it('deve lançar NotFoundException quando wishlist não é encontrada', async () => {
        wishlistGateway.addItem.mockResolvedValue(null as any);

        await expect(useCase.execute(validToken, validWishlistUuid, validItemData)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validItemData);
      });

      it('deve lançar NotFoundException quando gateway retorna erro 404', async () => {
        const gatewayError = new Error('404 not found');
        wishlistGateway.addItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validItemData)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validItemData);
      });

      it('deve lançar NotFoundException quando item já existe (409)', async () => {
        const gatewayError = new Error('409 conflict');
        wishlistGateway.addItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validItemData)).rejects.toThrow(
          new NotFoundException('Item já existe na wishlist')
        );
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validItemData);
      });

      it('deve propagar erro quando gateway falha com erro genérico', async () => {
        const gatewayError = new Error('Erro de conexão');
        wishlistGateway.addItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validItemData)).rejects.toThrow('Erro de conexão');
        expect(wishlistGateway.addItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validItemData);
      });
    });

    describe('Estrutura de resposta', () => {
      it('deve retornar wishlist com estrutura completa', async () => {
        wishlistGateway.addItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, validItemData);

        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('userUuid');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('createdAt');
        expect(Array.isArray(result.items)).toBe(true);
      });

      it('deve manter dados originais da wishlist retornada', async () => {
        wishlistGateway.addItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, validItemData);

        expect(result).toEqual(mockWishlist);
        expect(result.uuid).toBe(mockWishlist.uuid);
        expect(result.name).toBe(mockWishlist.name);
        expect(result.items.length).toBe(mockWishlist.items.length);
      });
    });
  });
});
