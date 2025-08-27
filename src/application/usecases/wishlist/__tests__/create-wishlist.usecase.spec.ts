import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';

import { CreateWishlistUseCase } from '../create-wishlist.usecase';

describe('CreateWishlistUseCase', () => {
  let useCase: CreateWishlistUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockCreatedWishlist: Wishlist = {
    uuid: '123e4567-e89b-12d3-a456-426614174001',
    userUuid: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Favoritos Games',
    items: [
      {
        productUuid: 'a7e3fa46-57c0-4d39-9337-3b0da8931e30',
        addedAt: new Date('2025-08-05T21:56:49.825Z'),
        notes: 'Quero comprar na Black Friday meu Super Mario World',
      },
    ],
    createdAt: new Date('2025-08-05T21:56:49.825Z'),
    updatedAt: new Date('2025-08-05T21:56:49.825Z'),
  };

  const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXVpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSIsImlhdCI6MTc1NDQzMTQ3NywiZXhwIjoxNzU0NDc0Njc3fQ.wsnKivT4AF5UKKSBb2N1mp9vKW7NqrmzSuBcpUXo0h4';

  beforeEach(async () => {
    const mockWishlistGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWishlistUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<CreateWishlistUseCase>(CreateWishlistUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');
  });

  describe('execute', () => {
    it('deve criar wishlist com sucesso quando dados válidos são fornecidos', async () => {
      const createWishlistData: CreateWishlistInputDto = {
        name: 'Favoritos Games',
        items: [
          {
            productUuid: 'a7e3fa46-57c0-4d39-9337-3b0da8931e30',
            notes: 'Quero comprar na Black Friday meu Super Mario World',
          },
        ],
      };
      wishlistGateway.create.mockResolvedValue(mockCreatedWishlist);

      const result = await useCase.execute(validToken, createWishlistData);

      expect(result).toEqual(mockCreatedWishlist);
      expect(wishlistGateway.create).toHaveBeenCalledWith(validToken, createWishlistData);
      expect(wishlistGateway.create).toHaveBeenCalledTimes(1);
    });

    it('deve criar wishlist vazia quando não há itens', async () => {
      const createWishlistData: CreateWishlistInputDto = {
        name: 'Lista Vazia',
      };
      const emptyWishlist = { ...mockCreatedWishlist, name: 'Lista Vazia', items: [] };
      wishlistGateway.create.mockResolvedValue(emptyWishlist);

      const result = await useCase.execute(validToken, createWishlistData);

      expect(result).toEqual(emptyWishlist);
      expect(wishlistGateway.create).toHaveBeenCalledWith(validToken, createWishlistData);
    });

    describe('Validação de token', () => {
      it('deve lançar UnauthorizedException quando token está vazio', async () => {
        const token = '';
        const createWishlistData: CreateWishlistInputDto = { name: 'Test' };

        await expect(useCase.execute(token, createWishlistData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token é null', async () => {
        const token = null as any;
        const createWishlistData: CreateWishlistInputDto = { name: 'Test' };

        await expect(useCase.execute(token, createWishlistData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar UnauthorizedException quando token contém apenas espaços', async () => {
        const token = '   ';
        const createWishlistData: CreateWishlistInputDto = { name: 'Test' };

        await expect(useCase.execute(token, createWishlistData)).rejects.toThrow(
          new UnauthorizedException('Token de autorização é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });
    });

    describe('Validação de dados', () => {
      it('deve lançar BadRequestException quando nome está vazio', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: '' };

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('Nome da lista é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando nome é null', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: null as any };

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('Nome da lista é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando nome contém apenas espaços', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: '   ' };

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('Nome da lista é obrigatório')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando item não tem productUuid', async () => {
        const createWishlistData: CreateWishlistInputDto = {
          name: 'Test',
          items: [{ productUuid: '', notes: 'test' }],
        };

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório para todos os itens')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });

      it('deve lançar BadRequestException quando item tem productUuid apenas com espaços', async () => {
        const createWishlistData: CreateWishlistInputDto = {
          name: 'Test',
          items: [{ productUuid: '   ', notes: 'test' }],
        };

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('UUID do produto é obrigatório para todos os itens')
        );
        expect(wishlistGateway.create).not.toHaveBeenCalled();
      });
    });

    describe('Cenários de erro do gateway', () => {
      it('deve lançar BadRequestException quando wishlist já existe', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: 'Existing List' };
        const gatewayError = new Error('409 Conflict');
        wishlistGateway.create.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow(
          new BadRequestException('Já existe uma wishlist com este nome')
        );
        expect(wishlistGateway.create).toHaveBeenCalledWith(validToken, createWishlistData);
      });

      it('deve propagar erro quando gateway falha', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: 'Test' };
        const gatewayError = new Error('Erro de conexão');
        wishlistGateway.create.mockRejectedValue(gatewayError);

        await expect(useCase.execute(validToken, createWishlistData)).rejects.toThrow('Erro de conexão');
        expect(wishlistGateway.create).toHaveBeenCalledWith(validToken, createWishlistData);
      });
    });

    describe('Estrutura de resposta', () => {
      it('deve retornar wishlist com estrutura completa', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: 'Test' };
        wishlistGateway.create.mockResolvedValue(mockCreatedWishlist);

        const result = await useCase.execute(validToken, createWishlistData);

        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('userUuid');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('items');
        expect(result).toHaveProperty('createdAt');
        expect(Array.isArray(result.items)).toBe(true);
      });

      it('deve manter dados originais da wishlist criada', async () => {
        const createWishlistData: CreateWishlistInputDto = { name: 'Favoritos Games' };
        wishlistGateway.create.mockResolvedValue(mockCreatedWishlist);

        const result = await useCase.execute(validToken, createWishlistData);

        expect(result.name).toBe('Favoritos Games');
        expect(result.items).toHaveLength(1);
        expect(result.items[0].productUuid).toBe('a7e3fa46-57c0-4d39-9337-3b0da8931e30');
      });
    });
  });
});
