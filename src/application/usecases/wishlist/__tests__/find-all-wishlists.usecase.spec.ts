import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';

import { FindAllWishlistsUseCase } from '../find-all-wishlists.usecase';

describe('FindAllWishlistsUseCase', () => {
  let useCase: FindAllWishlistsUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlists: Wishlist[] = [
    {
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
    },
    {
      uuid: '123e4567-e89b-12d3-a456-426614174004',
      userUuid: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Lista de Aniversário',
      items: [],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllWishlistsUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<FindAllWishlistsUseCase>(FindAllWishlistsUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve retornar todas as wishlists quando token válido é fornecido', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      wishlistGateway.findAll.mockResolvedValue(mockWishlists);

      const result = await useCase.execute(token);

      expect(result).toEqual(mockWishlists);
      expect(wishlistGateway.findAll).toHaveBeenCalledWith(token);
      expect(wishlistGateway.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar array vazio quando usuário não tem wishlists', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      const emptyWishlists: Wishlist[] = [];
      wishlistGateway.findAll.mockResolvedValue(emptyWishlists);

      const result = await useCase.execute(token);

      expect(result).toEqual(emptyWishlists);
      expect(result).toHaveLength(0);
      expect(wishlistGateway.findAll).toHaveBeenCalledWith(token);
    });

    it('deve lançar UnauthorizedException quando token está vazio', async () => {
      const token = '';

      await expect(useCase.execute(token)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );
      expect(wishlistGateway.findAll).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando token é null', async () => {
      const token = null as any;

      await expect(useCase.execute(token)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );
      expect(wishlistGateway.findAll).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando token é undefined', async () => {
      const token = undefined as any;

      await expect(useCase.execute(token)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );
      expect(wishlistGateway.findAll).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
      const token = '   ';

      await expect(useCase.execute(token)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );
      expect(wishlistGateway.findAll).not.toHaveBeenCalled();
    });

    it('deve aceitar token com formato Bearer', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      wishlistGateway.findAll.mockResolvedValue(mockWishlists);

      const result = await useCase.execute(token);

      expect(result).toEqual(mockWishlists);
      expect(wishlistGateway.findAll).toHaveBeenCalledWith(token);
    });

    it('deve aceitar token sem formato Bearer', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      wishlistGateway.findAll.mockResolvedValue(mockWishlists);

      const result = await useCase.execute(token);

      expect(result).toEqual(mockWishlists);
      expect(wishlistGateway.findAll).toHaveBeenCalledWith(token);
    });

    it('deve propagar erro do gateway quando ocorre erro inesperado', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      const gatewayError = new Error('Erro de conexão');
      wishlistGateway.findAll.mockRejectedValue(gatewayError);

      await expect(useCase.execute(token)).rejects.toThrow('Erro de conexão');
      expect(wishlistGateway.findAll).toHaveBeenCalledWith(token);
    });

    it('deve retornar wishlists com estrutura correta', async () => {
      const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';
      wishlistGateway.findAll.mockResolvedValue(mockWishlists);

      const result = await useCase.execute(token);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('uuid');
      expect(result[0]).toHaveProperty('userUuid');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('items');
      expect(result[0]).toHaveProperty('createdAt');
      expect(Array.isArray(result[0].items)).toBe(true);
    });
  });
});
