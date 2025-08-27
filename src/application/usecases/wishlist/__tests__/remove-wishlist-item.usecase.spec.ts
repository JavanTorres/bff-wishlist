import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';

import { RemoveWishlistItemUseCase } from '../remove-wishlist-item.usecase';

describe('RemoveWishlistItemUseCase', () => {
  let useCase: RemoveWishlistItemUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlist: Wishlist = {
    uuid: '9aa8faec-e6cd-474d-939a-648b7a735649',
    userUuid: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Favoritos Games',
    items: [
      {
        productUuid: 'a7e3fa46-57c0-4d39-9337-3b0da8931e30',
        addedAt: new Date('2025-08-06T01:47:20.339Z'),
        notes: 'Quero comprar na Black Friday meu Super Mario World',
      },
    ],
    createdAt: new Date('2025-08-06T01:47:20.339Z'),
    updatedAt: new Date('2025-08-06T01:47:20.339Z'),
  };

  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMDY1OCwiZXhwIjoxNzU0NDczODU4fQ.gVIehoY2UVd7h7Zj3wpRj2IMljEF0iZxUks0x7_eOaY';
  const validWishlistUuid = '9aa8faec-e6cd-474d-939a-648b7a735649';
  const validProductUuid = 'c24b7d7f-6c19-4f7a-beca-355cdf2933d2';

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      removeItem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveWishlistItemUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<RemoveWishlistItemUseCase>(RemoveWishlistItemUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve remover item da wishlist quando dados válidos são fornecidos', async () => {
      wishlistGateway.removeItem.mockResolvedValue(mockWishlist);

      const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

      expect(result).toEqual(mockWishlist);
      expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      expect(wishlistGateway.removeItem).toHaveBeenCalledTimes(1);
    });

    describe('Validação de token', () => {
      it('deve lançar UnauthorizedException quando token está vazio', async () => {
        const token = '';

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é null', async () => {
        const token = null as any;

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é undefined', async () => {
        const token = undefined as any;

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
        const token = '   ';

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID da wishlist', () => {
      it('deve lançar BadRequestException quando UUID da wishlist está vazio', async () => {
        const wishlistUuid = '';

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist é null', async () => {
        const wishlistUuid = null as any;

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist é undefined', async () => {
        const wishlistUuid = undefined as any;

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist contém apenas espaços', async () => {
        const wishlistUuid = '   ';

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist tem formato inválido', async () => {
        const wishlistUuid = 'invalid-uuid-format';

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist deve ter um formato válido')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve aceitar UUID da wishlist válido', async () => {
        const wishlistUuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.removeItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, wishlistUuid, validProductUuid);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, wishlistUuid, validProductUuid);
      });
    });

    describe('Validação de UUID do produto', () => {
      it('deve lançar BadRequestException quando UUID do produto está vazio', async () => {
        const productUuid = '';

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto é null', async () => {
        const productUuid = null as any;

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto é undefined', async () => {
        const productUuid = undefined as any;

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto contém apenas espaços', async () => {
        const productUuid = '   ';

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto tem formato inválido', async () => {
        const productUuid = 'invalid-uuid-format';

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto deve ter um formato válido')
        );
        expect(wishlistGateway.removeItem).not.toHaveBeenCalled();
      });

      it('deve aceitar UUID do produto válido', async () => {
        const productUuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.removeItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, productUuid);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, productUuid);
      });
    });

    describe('Cenários de erro do gateway', () => {
      it('deve lançar NotFoundException quando wishlist não é encontrada', async () => {
        wishlistGateway.removeItem.mockResolvedValue(null as any);

        await expect(useCase.execute(validToken, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve lançar NotFoundException quando wishlist retorna undefined', async () => {
        wishlistGateway.removeItem.mockResolvedValue(undefined as any);

        await expect(useCase.execute(validToken, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve lançar NotFoundException quando gateway retorna erro 404', async () => {
        const gatewayError = new Error('404 not found');
        wishlistGateway.removeItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new NotFoundException('Wishlist ou item não encontrado')
        );
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve propagar erro quando gateway falha com erro genérico', async () => {
        const gatewayError = new Error('Erro de conexão');
        wishlistGateway.removeItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validProductUuid)).rejects.toThrow('Erro de conexão');
        expect(wishlistGateway.removeItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });
    });

    describe('Estrutura de resposta', () => {
      it('deve retornar wishlist com estrutura completa', async () => {
        wishlistGateway.removeItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('userUuid');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('createdAt');
        expect(Array.isArray(result.items)).toBe(true);
      });

      it('deve manter dados originais da wishlist retornada', async () => {
        wishlistGateway.removeItem.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual(mockWishlist);
        expect(result.uuid).toBe(mockWishlist.uuid);
        expect(result.name).toBe(mockWishlist.name);
        expect(result.items.length).toBe(mockWishlist.items.length);
      });
    });
  });
});
