import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';

import { FindWishlistByIdUseCase } from '../find-wishlist-by-id.usecase';

describe('FindWishlistByIdUseCase', () => {
  let useCase: FindWishlistByIdUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlist: Wishlist = {
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    userUuid: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Lista de Natal',
    items: [
      {
        productUuid: '123e4567-e89b-12d3-a456-426614174003',
        addedAt: new Date('2024-01-01'),
        notes: 'Produto favorito',
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
  const validUuid = '123e4567-e89b-12d3-a456-426614174001';

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindWishlistByIdUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<FindWishlistByIdUseCase>(FindWishlistByIdUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve retornar wishlist quando token e UUID válidos são fornecidos', async () => {
      wishlistGateway.findById.mockResolvedValue(mockWishlist);

      const result = await useCase.execute(validToken, validUuid);

      expect(result).toEqual(mockWishlist);
      expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, validUuid);
      expect(wishlistGateway.findById).toHaveBeenCalledTimes(1);
    });

    describe('Validação de token', () => {
      it('deve lançar UnauthorizedException quando token está vazio', async () => {
        const token = '';

        await expect(useCase.execute(token, validUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é null', async () => {
        const token = null as any;

        await expect(useCase.execute(token, validUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é undefined', async () => {
        const token = undefined as any;

        await expect(useCase.execute(token, validUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
        const token = '   ';

        await expect(useCase.execute(token, validUuid)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });
    });

    describe('Validação de UUID', () => {
      it('deve lançar BadRequestException quando UUID está vazio', async () => {
        const uuid = '';

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID é null', async () => {
        const uuid = null as any;

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID é undefined', async () => {
        const uuid = undefined as any;

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID contém apenas espaços', async () => {
        const uuid = '   ';

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID é obrigatório')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID tem formato inválido', async () => {
        const uuid = 'invalid-uuid-format';

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID deve ter um formato válido')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando UUID tem apenas números', async () => {
        const uuid = '12345678901234567890123456789012';

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new BadRequestException('UUID deve ter um formato válido')
        );
        expect(wishlistGateway.findById).not.toHaveBeenCalled();
      });

      it('deve aceitar UUID válido no formato padrão', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, uuid);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, uuid);
      });

      it('deve aceitar UUID válido com diferentes caracteres', async () => {
        const uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
        wishlistGateway.findById.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, uuid);

        expect(result).toEqual(mockWishlist);
        expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, uuid);
      });
    });

    describe('Cenários de erro do gateway', () => {
      it('deve lançar NotFoundException quando wishlist não é encontrada', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(null as any);

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, uuid);
      });

      it('deve lançar NotFoundException quando gateway retorna undefined', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(undefined as any);

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow(
          new NotFoundException('Wishlist não encontrada')
        );
        expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, uuid);
      });

      it('deve propagar erro quando gateway falha', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        const gatewayError = new Error('Erro de conexão');
        wishlistGateway.findById.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, uuid)).rejects.toThrow('Erro de conexão');
        expect(wishlistGateway.findById).toHaveBeenCalledWith(validToken, uuid);
      });

      it('deve retornar wishlist com estrutura completa', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, uuid);

        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('userUuid');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('createdAt');
        expect(Array.isArray(result.items)).toBe(true);
      });

      it('deve retornar wishlist vazia quando não tem items', async () => {
        const emptyWishlist = {
          ...mockWishlist,
          items: [],
        };
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(emptyWishlist);

        const result = await useCase.execute(validToken, uuid);

        expect(result.items).toHaveLength(0);
        expect(Array.isArray(result.items)).toBe(true);
      });

      it('deve manter dados originais da wishlist retornada', async () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        wishlistGateway.findById.mockResolvedValue(mockWishlist);

        const result = await useCase.execute(validToken, uuid);

        expect(result).toEqual(mockWishlist);
        expect(result.uuid).toBe(mockWishlist.uuid);
        expect(result.name).toBe(mockWishlist.name);
        expect(result.items.length).toBe(mockWishlist.items.length);
      });
    });
  });
});
