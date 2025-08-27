import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { CheckWishlistItemDto } from '@presentation/dto/check-wishlist-item.dto';

import { CheckWishlistItemUseCase } from '../check-wishlist-item.usecase';

describe('CheckWishlistItemUseCase', () => {
  let useCase: CheckWishlistItemUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockItemExists: CheckWishlistItemDto = {
    exists: true,
    item: {
      productUuid: '8e9d0a12-c9b7-4d4b-9135-416b4429c125',
      addedAt: new Date('2025-08-06T01:47:20.339Z'),
      notes: 'Quero comprar na Black Friday meu The Legend of Zelda: Ocarina of Time',
      _id: '6892bfb0896fb29f57f40602',
    },
  };

  const mockItemNotExists: CheckWishlistItemDto = {
    exists: false,
  };

  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMDY1OCwiZXhwIjoxNzU0NDczODU4fQ.gVIehoY2UVd7h7Zj3wpRj2IMljEF0iZxUks0x7_eOaY';
  const validWishlistUuid = '9aa8faec-e6cd-474d-939a-648b7a735649';
  const validProductUuid = '8e9d0a12-c9b7-4d4b-9135-416b4429c125';

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      removeItem: jest.fn(),
      addItem: jest.fn(),
      checkItem: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckWishlistItemUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<CheckWishlistItemUseCase>(CheckWishlistItemUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve retornar que o item existe quando encontrado na wishlist', async () => {
      wishlistGateway.checkItem.mockResolvedValue(mockItemExists);

      const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

      expect(result).toEqual(mockItemExists);
      expect(result.exists).toBe(true);
      expect(result.item).toBeDefined();
      expect(result.item?.productUuid).toBe(validProductUuid);
      expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      expect(wishlistGateway.checkItem).toHaveBeenCalledTimes(1);
    });

    it('deve retornar que o item não existe quando não encontrado na wishlist', async () => {
      wishlistGateway.checkItem.mockResolvedValue(mockItemNotExists);

      const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

      expect(result).toEqual(mockItemNotExists);
      expect(result.exists).toBe(false);
      expect(result.item).toBeUndefined();
      expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      expect(wishlistGateway.checkItem).toHaveBeenCalledTimes(1);
    });

    describe('Validação de token', () => {
      it('deve lançar UnauthorizedException quando token está vazio', async () => {
        const token = '';

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é null', async () => {
        const token = null as any;

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é undefined', async () => {
        const token = undefined as any;

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
        const token = '   ';

        await expect(useCase.execute(token, validWishlistUuid, validProductUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID da wishlist', () => {
      it('deve lançar BadRequestException quando UUID da wishlist está vazio', async () => {
        const wishlistUuid = '';

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist é null', async () => {
        const wishlistUuid = null as any;

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID da wishlist tem formato inválido', async () => {
        const wishlistUuid = 'invalid-uuid-format';

        await expect(useCase.execute(validToken, wishlistUuid, validProductUuid)).rejects.toThrow(
          new BadRequestException('UUID da wishlist deve ter um formato válido')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID do produto', () => {
      it('deve lançar BadRequestException quando UUID do produto está vazio', async () => {
        const productUuid = '';

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto é null', async () => {
        const productUuid = null as any;

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID do produto tem formato inválido', async () => {
        const productUuid = 'invalid-uuid';

        await expect(useCase.execute(validToken, validWishlistUuid, productUuid)).rejects.toThrow(
          new BadRequestException('UUID do produto deve ter um formato válido')
        );
        expect(wishlistGateway.checkItem).not.toHaveBeenCalled();
      });
    });

    describe('Cenários de erro do gateway', () => {
      it('deve retornar exists=false quando gateway retorna erro 404', async () => {
        const gatewayError = new Error('404 not found');
        wishlistGateway.checkItem.mockRejectedValue(gatewayError);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual({ exists: false });
        expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve retornar exists=false quando gateway retorna erro com "not found"', async () => {
        const gatewayError = new Error('Item not found in wishlist');
        wishlistGateway.checkItem.mockRejectedValue(gatewayError);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual({ exists: false });
        expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve retornar exists=false quando gateway retorna erro com "não encontrada"', async () => {
        const gatewayError = new Error('Wishlist uuid 9aa8faec-e6cd-474d-939a-648b7a735641 não encontrada.');
        wishlistGateway.checkItem.mockRejectedValue(gatewayError);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual({ exists: false });
        expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve retornar exists=false quando gateway retorna erro com statusCode 404', async () => {
        const gatewayError = { message: 'Not Found', statusCode: 404 };
        wishlistGateway.checkItem.mockRejectedValue(gatewayError);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual({ exists: false });
        expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });

      it('deve propagar erro quando gateway falha com erro genérico', async () => {
        const gatewayError = new Error('Erro de conexão');
        wishlistGateway.checkItem.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, validWishlistUuid, validProductUuid)).rejects.toThrow('Erro de conexão');
        expect(wishlistGateway.checkItem).toHaveBeenCalledWith(validToken, validWishlistUuid, validProductUuid);
      });
    });

    describe('Estrutura de resposta', () => {
      it('deve retornar resposta com exists=true e item quando produto existe', async () => {
        wishlistGateway.checkItem.mockResolvedValue(mockItemExists);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toHaveProperty('exists');
        expect(result.exists).toBe(true);
        expect(result).toHaveProperty('item');
        expect(result.item).toHaveProperty('productUuid');
        expect(result.item).toHaveProperty('addedAt');
        expect(result.item?.productUuid).toBe(validProductUuid);
      });

      it('deve retornar resposta com exists=false sem item quando produto não existe', async () => {
        wishlistGateway.checkItem.mockResolvedValue(mockItemNotExists);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toHaveProperty('exists');
        expect(result.exists).toBe(false);
        expect(result.item).toBeUndefined();
      });

      it('deve manter dados originais do item retornado', async () => {
        wishlistGateway.checkItem.mockResolvedValue(mockItemExists);

        const result = await useCase.execute(validToken, validWishlistUuid, validProductUuid);

        expect(result).toEqual(mockItemExists);
        expect(result.item?.notes).toBe(mockItemExists.item?.notes);
        expect(result.item?._id).toBe(mockItemExists.item?._id);
      });
    });
  });
});
