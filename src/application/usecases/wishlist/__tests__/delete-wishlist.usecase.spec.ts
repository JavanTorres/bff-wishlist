import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { DeleteWishlistUseCase } from '@application/usecases/wishlist/delete-wishlist.usecase';

describe('DeleteWishlistUseCase', () => {
  let useCase: DeleteWishlistUseCase;
  let wishlistGateway: jest.Mocked<WishlistGatewayPort>;

  const mockWishlistGateway = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteWishlistUseCase,
        {
          provide: 'WishlistGatewayPort',
          useValue: mockWishlistGateway,
        },
      ],
    }).compile();

    useCase = module.get<DeleteWishlistUseCase>(DeleteWishlistUseCase);
    wishlistGateway = module.get('WishlistGatewayPort');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const validToken = 'Bearer valid-token';
    const validWishlistUuid = '9aa8faec-e6cd-474d-939a-648b7a735649';

    it('deve deletar wishlist com sucesso', async () => {
      wishlistGateway.delete.mockResolvedValue();

      await useCase.execute(validToken, validWishlistUuid);

      expect(wishlistGateway.delete).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve lançar erro quando token não é fornecido', async () => {
      await expect(useCase.execute('', validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é null', async () => {
      await expect(useCase.execute(null as any, validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é undefined', async () => {
      await expect(useCase.execute(undefined as any, validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando token é apenas espaços em branco', async () => {
      await expect(useCase.execute('   ', validWishlistUuid)).rejects.toThrow(
        new UnauthorizedException('Token de autorização é obrigatório')
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid é null', async () => {
      await expect(useCase.execute(validToken, null as any)).rejects.toThrow(
        'UUID da wishlist é obrigatório'
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid é undefined', async () => {
      await expect(useCase.execute(validToken, undefined as any)).rejects.toThrow(
        'UUID da wishlist é obrigatório'
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando wishlistUuid tem formato inválido', async () => {
      await expect(useCase.execute(validToken, 'invalid-uuid-format')).rejects.toThrow(
        'UUID da wishlist deve ter um formato válido'
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });

    it('deve propagar erro do gateway quando ocorre falha na comunicação', async () => {
      const gatewayError = new Error('Erro de conexão');
      wishlistGateway.delete.mockRejectedValue(gatewayError);

      await expect(useCase.execute(validToken, validWishlistUuid)).rejects.toThrow('Erro de conexão');

      expect(wishlistGateway.delete).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve propagar erro 404 quando wishlist não é encontrada', async () => {
      const notFoundError = new Error('Wishlist não encontrada');
      wishlistGateway.delete.mockRejectedValue(notFoundError);

      await expect(useCase.execute(validToken, validWishlistUuid)).rejects.toThrow('Wishlist não encontrada');

      expect(wishlistGateway.delete).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve propagar erro 403 quando usuário não tem permissão', async () => {
      const forbiddenError = new Error('Acesso negado');
      wishlistGateway.delete.mockRejectedValue(forbiddenError);

      await expect(useCase.execute(validToken, validWishlistUuid)).rejects.toThrow('Acesso negado');

      expect(wishlistGateway.delete).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve executar sem erro quando delete é bem-sucedido', async () => {
      wishlistGateway.delete.mockResolvedValue();

      await expect(useCase.execute(validToken, validWishlistUuid)).resolves.not.toThrow();

      expect(wishlistGateway.delete).toHaveBeenCalledWith(validToken, validWishlistUuid);
    });

    it('deve validar UUID antes de chamar o gateway', async () => {
      const invalidUuid = 'not-a-valid-uuid';

      await expect(useCase.execute(validToken, invalidUuid)).rejects.toThrow(
        'UUID da wishlist deve ter um formato válido'
      );

      expect(wishlistGateway.delete).not.toHaveBeenCalled();
    });
  });
});
