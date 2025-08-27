import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { FindWishlistItemsUseCase } from '@application/usecases/wishlist/find-wishlist-items.usecase';
import { FindWishlistItemsDto } from '@presentation/dto/find-wishlist-items.dto';

describe('FindWishlistItemsUseCase', () => {
  let useCase: FindWishlistItemsUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlistGateway = {
    findWishlistItems: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindWishlistItemsUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<FindWishlistItemsUseCase>(FindWishlistItemsUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validToken = 'Bearer valid-token';
    const validWishlistUuid = '9aa8faec-e6cd-474d-939a-648b7a735649';

    const mockWishlistItemsResponse: FindWishlistItemsDto = {
      uuid: validWishlistUuid,
      items: [
        {
          productUuid: '8e9d0a12-c9b7-4d4b-9135-416b4429c125',
          addedAt: new Date('2025-08-06T01:47:20.339Z'),
          notes: 'Quero comprar na Black Friday meu The Legend of Zelda: Ocarina of Time'
        },
        {
          productUuid: 'b122db63-1a91-4711-b9e8-6f007e460723',
          addedAt: new Date('2025-08-06T01:47:20.339Z'),
          notes: 'Quero comprar na Black Friday meu Street Fighter II'
        }
      ],
      totalItems: 2,
      remainingSlots: 18
    };

    it('deve retornar todos os itens da wishlist com sucesso', async () => {
      wishlistGateway.findWishlistItems.mockResolvedValue(mockWishlistItemsResponse);

      const result = await useCase.execute(validToken, validWishlistUuid);

      expect(wishlistGateway.findWishlistItems).toHaveBeenCalledWith(validToken, validWishlistUuid);
      expect(result).toEqual(mockWishlistItemsResponse);
    });

    it('deve lançar erro quando token não é fornecido', async () => {
      await expect(useCase.execute('', validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é null', async () => {
      await expect(useCase.execute(null as any, validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é undefined', async () => {
      await expect(useCase.execute(undefined as any, validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é apenas espaços em branco', async () => {
      await expect(useCase.execute('   ', validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid é null', async () => {
      await expect(useCase.execute(validToken, null as any)).rejects.toThrow(
        'UUID da wishlist é obrigatório'
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid é undefined', async () => {
      await expect(useCase.execute(validToken, undefined as any)).rejects.toThrow(
        'UUID da wishlist é obrigatório'
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid tem formato inválido', async () => {
      await expect(useCase.execute(validToken, 'invalid-uuid-format')).rejects.toThrow(
        'UUID da wishlist deve ter um formato válido'
      );

      expect(wishlistGateway.findWishlistItems).not.toHaveBeenCalled();
    });

    it('deve retornar wishlist vazia quando não há itens', async () => {
      const emptyWishlistResponse: FindWishlistItemsDto = {
        uuid: validWishlistUuid,
        items: [],
        totalItems: 0,
        remainingSlots: 20
      };

      wishlistGateway.findWishlistItems.mockResolvedValue(emptyWishlistResponse);

      const result = await useCase.execute(validToken, validWishlistUuid);

      expect(wishlistGateway.findWishlistItems).toHaveBeenCalledWith(validToken, validWishlistUuid);
      expect(result).toEqual(emptyWishlistResponse);
      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(result.remainingSlots).toBe(20);
    });

    it('deve propagar erro do gateway quando ocorre falha na comunicação', async () => {
      const gatewayError = new Error('Erro de conexão');
      wishlistGateway.findWishlistItems.mockRejectedValue(gatewayError);

      await expect(useCase.execute(validToken, validWishlistUuid)).rejects.toThrow('Erro de conexão');

      expect(wishlistGateway.findWishlistItems).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve retornar wishlist com muitos itens', async () => {
      const manyItemsResponse: FindWishlistItemsDto = {
        uuid: validWishlistUuid,
        items: Array.from({ length: 15 }, (_, i) => ({
          productUuid: `product-${i}`,
          addedAt: new Date('2025-08-06T01:47:20.339Z'),
          notes: `Produto ${i + 1}`
        })),
        totalItems: 15,
        remainingSlots: 5
      };

      wishlistGateway.findWishlistItems.mockResolvedValue(manyItemsResponse);

      const result = await useCase.execute(validToken, validWishlistUuid);

      expect(wishlistGateway.findWishlistItems).toHaveBeenCalledWith(validToken, validWishlistUuid);
      expect(result).toEqual(manyItemsResponse);
      expect(result.items).toHaveLength(15);
      expect(result.totalItems).toBe(15);
      expect(result.remainingSlots).toBe(5);
    });

    it('deve lidar com itens sem notas', async () => {
      const itemsWithoutNotesResponse: FindWishlistItemsDto = {
        uuid: validWishlistUuid,
        items: [
          {
            productUuid: '8e9d0a12-c9b7-4d4b-9135-416b4429c125',
            addedAt: new Date('2025-08-06T01:47:20.339Z')
          }
        ],
        totalItems: 1,
        remainingSlots: 19
      };

      wishlistGateway.findWishlistItems.mockResolvedValue(itemsWithoutNotesResponse);

      const result = await useCase.execute(validToken, validWishlistUuid);

      expect(wishlistGateway.findWishlistItems).toHaveBeenCalledWith(validToken, validWishlistUuid);
      expect(result).toEqual(itemsWithoutNotesResponse);
      expect(result.items[0].notes).toBeUndefined();
    });
  });
});
