import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { UpdateWishlistInputDto } from '@presentation/dto/update-wishlist.dto';

import { UpdateWishlistUseCase } from '../update-wishlist.usecase';

describe('UpdateWishlistUseCase', () => {
  let useCase: UpdateWishlistUseCase;
  let mockWishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlistResponse = {
    uuid: '92a355c2-ddb5-4e0b-afb7-2d6f1781f1fe',
    userUuid: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Favoritos Games javan 3',
    items: [
      {
        productUuid: '123e4567-e89b-12d3-a456-426614174000',
        addedAt: '2025-08-06T13:20:53.063Z',
        notes: 'Quero comprar na Black Friday meu BATTLEFIELD 6'
      }
    ],
    createdAt: '2025-08-06T04:10:40.783Z'
  };

  beforeEach(async () => {
    const mockGateway = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateWishlistUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockGateway,
        },
      ],
    }).compile();

    useCase = module.get<UpdateWishlistUseCase>(UpdateWishlistUseCase);
    mockWishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    const validToken = 'Bearer valid-token';
    const validUuid = '92a355c2-ddb5-4e0b-afb7-2d6f1781f1fe';
    const validUpdateData: UpdateWishlistInputDto = {
      name: 'Favoritos Games javan 3',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174000',
          notes: 'Quero comprar na Black Friday meu BATTLEFIELD 6'
        }
      ]
    };

    it('deve atualizar wishlist com sucesso', async () => {
      mockWishlistGateway.update.mockResolvedValue(mockWishlistResponse as any);

      const result = await useCase.execute(validToken, validUuid, validUpdateData);

      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, validUpdateData);
      expect(result).toEqual(mockWishlistResponse);
    });

    // Testes de validação de token
    it('deve lançar erro quando token não é fornecido', async () => {
      await expect(useCase.execute('', validUuid, validUpdateData))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é null', async () => {
      await expect(useCase.execute(null as any, validUuid, validUpdateData))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é undefined', async () => {
      await expect(useCase.execute(undefined as any, validUuid, validUpdateData))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é apenas espaços em branco', async () => {
      await expect(useCase.execute('   ', validUuid, validUpdateData))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    // Testes de validação de UUID
    it('deve lançar erro quando wishlistUuid é null', async () => {
      await expect(useCase.execute(validToken, null as any, validUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid é undefined', async () => {
      await expect(useCase.execute(validToken, undefined as any, validUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid tem formato inválido', async () => {
      await expect(useCase.execute(validToken, 'invalid-uuid-format', validUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    // Testes de validação de nome
    it('deve lançar erro quando nome não é fornecido', async () => {
      const invalidUpdateData = { ...validUpdateData, name: '' };
      
      await expect(useCase.execute(validToken, validUuid, invalidUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando nome é null', async () => {
      const invalidUpdateData = { ...validUpdateData, name: null as any };
      
      await expect(useCase.execute(validToken, validUuid, invalidUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando nome é apenas espaços em branco', async () => {
      const invalidUpdateData = { ...validUpdateData, name: '   ' };
      
      await expect(useCase.execute(validToken, validUuid, invalidUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    // Testes de validação de items
    it('deve lançar erro quando productUuid de item é inválido', async () => {
      const invalidUpdateData: UpdateWishlistInputDto = {
        name: 'Lista válida',
        items: [
          {
            productUuid: 'invalid-uuid-format',
            notes: 'Nota válida'
          }
        ]
      };
      
      await expect(useCase.execute(validToken, validUuid, invalidUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve aceitar lista vazia de items', async () => {
      const updateDataWithEmptyItems = { ...validUpdateData, items: [] };
      mockWishlistGateway.update.mockResolvedValue({ ...mockWishlistResponse, items: [] } as any);

      const result = await useCase.execute(validToken, validUuid, updateDataWithEmptyItems);

      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, updateDataWithEmptyItems);
      expect(result.items).toEqual([]);
    });

    // Testes de erro do gateway
    it('deve propagar erro do gateway quando ocorre falha na comunicação', async () => {
      mockWishlistGateway.update.mockRejectedValue(new Error('Erro de conexão'));

      await expect(useCase.execute(validToken, validUuid, validUpdateData))
        .rejects.toThrow('Erro de conexão');
      
      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, validUpdateData);
    });

    it('deve propagar erro 404 quando wishlist não é encontrada', async () => {
      mockWishlistGateway.update.mockRejectedValue(new Error('Wishlist não encontrada'));

      await expect(useCase.execute(validToken, validUuid, validUpdateData))
        .rejects.toThrow('Wishlist não encontrada');
      
      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, validUpdateData);
    });

    it('deve propagar erro 403 quando usuário não tem permissão', async () => {
      mockWishlistGateway.update.mockRejectedValue(new Error('Acesso negado'));

      await expect(useCase.execute(validToken, validUuid, validUpdateData))
        .rejects.toThrow('Acesso negado');
      
      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, validUpdateData);
    });

    it('deve executar sem erro quando update é bem-sucedido', async () => {
      mockWishlistGateway.update.mockResolvedValue(mockWishlistResponse as any);

      await expect(useCase.execute(validToken, validUuid, validUpdateData))
        .resolves.not.toThrow();
      
      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, validUpdateData);
    });

    it('deve validar UUID antes de chamar o gateway', async () => {
      const invalidUuid = 'not-a-valid-uuid';

      await expect(useCase.execute(validToken, invalidUuid, validUpdateData))
        .rejects.toThrow(BadRequestException);
      
      expect(mockWishlistGateway.update).not.toHaveBeenCalled();
    });

    it('deve processar items com notes opcionais', async () => {
      const updateDataWithOptionalNotes: UpdateWishlistInputDto = {
        name: 'Lista com items sem notes',
        items: [
          {
            productUuid: '123e4567-e89b-12d3-a456-426614174000'
          }
        ]
      };
      
      mockWishlistGateway.update.mockResolvedValue(mockWishlistResponse as any);

      const result = await useCase.execute(validToken, validUuid, updateDataWithOptionalNotes);

      expect(mockWishlistGateway.update).toHaveBeenCalledWith(validToken, validUuid, updateDataWithOptionalNotes);
      expect(result).toEqual(mockWishlistResponse);
    });
  });
});
