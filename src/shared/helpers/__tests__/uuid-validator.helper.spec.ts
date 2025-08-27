import { BadRequestException } from '@nestjs/common';

import { UuidValidator } from '../uuid-validator.helper';

describe('UuidValidator', () => {
  describe('validate', () => {
    it('deve passar quando UUID válido é fornecido', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174001';
      
      expect(() => UuidValidator.validate(validUuid)).not.toThrow();
    });

    it('deve passar quando UUID válido é fornecido com fieldName customizado', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174001';
      
      expect(() => UuidValidator.validate(validUuid, 'UUID da wishlist')).not.toThrow();
    });

    it('deve lançar BadRequestException quando UUID está vazio', () => {
      expect(() => UuidValidator.validate('')).toThrow(
        new BadRequestException('UUID é obrigatório')
      );
    });

    it('deve lançar BadRequestException quando UUID é null', () => {
      expect(() => UuidValidator.validate(null as any)).toThrow(
        new BadRequestException('UUID é obrigatório')
      );
    });

    it('deve lançar BadRequestException quando UUID é undefined', () => {
      expect(() => UuidValidator.validate(undefined as any)).toThrow(
        new BadRequestException('UUID é obrigatório')
      );
    });

    it('deve lançar BadRequestException quando UUID contém apenas espaços', () => {
      expect(() => UuidValidator.validate('   ')).toThrow(
        new BadRequestException('UUID é obrigatório')
      );
    });

    it('deve lançar BadRequestException quando UUID tem formato inválido', () => {
      expect(() => UuidValidator.validate('invalid-uuid')).toThrow(
        new BadRequestException('UUID deve ter um formato válido')
      );
    });

    it('deve usar fieldName customizado na mensagem de erro para campo obrigatório', () => {
      expect(() => UuidValidator.validate('', 'UUID da wishlist')).toThrow(
        new BadRequestException('UUID da wishlist é obrigatório')
      );
    });

    it('deve usar fieldName customizado na mensagem de erro para formato inválido', () => {
      expect(() => UuidValidator.validate('invalid-uuid', 'UUID do produto')).toThrow(
        new BadRequestException('UUID do produto deve ter um formato válido')
      );
    });
  });

  describe('validateMultiple', () => {
    it('deve passar quando todos os UUIDs são válidos', () => {
      const uuids = [
        { uuid: '123e4567-e89b-12d3-a456-426614174001', fieldName: 'UUID da wishlist' },
        { uuid: '123e4567-e89b-12d3-a456-426614174002', fieldName: 'UUID do produto' },
      ];
      
      expect(() => UuidValidator.validateMultiple(uuids)).not.toThrow();
    });

    it('deve lançar BadRequestException quando primeiro UUID é inválido', () => {
      const uuids = [
        { uuid: '', fieldName: 'UUID da wishlist' },
        { uuid: '123e4567-e89b-12d3-a456-426614174002', fieldName: 'UUID do produto' },
      ];
      
      expect(() => UuidValidator.validateMultiple(uuids)).toThrow(
        new BadRequestException('UUID da wishlist é obrigatório')
      );
    });

    it('deve lançar BadRequestException quando segundo UUID é inválido', () => {
      const uuids = [
        { uuid: '123e4567-e89b-12d3-a456-426614174001', fieldName: 'UUID da wishlist' },
        { uuid: 'invalid-uuid', fieldName: 'UUID do produto' },
      ];
      
      expect(() => UuidValidator.validateMultiple(uuids)).toThrow(
        new BadRequestException('UUID do produto deve ter um formato válido')
      );
    });
  });

  describe('validateProductUuids', () => {
    it('deve passar quando array está vazio', () => {
      expect(() => UuidValidator.validateProductUuids([])).not.toThrow();
    });

    it('deve passar quando array é undefined', () => {
      expect(() => UuidValidator.validateProductUuids(undefined as any)).not.toThrow();
    });

    it('deve passar quando array é null', () => {
      expect(() => UuidValidator.validateProductUuids(null as any)).not.toThrow();
    });

    it('deve passar quando todos os productUuids são válidos', () => {
      const items = [
        { productUuid: '123e4567-e89b-12d3-a456-426614174001' },
        { productUuid: '123e4567-e89b-12d3-a456-426614174002' },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).not.toThrow();
    });

    it('deve lançar BadRequestException quando productUuid está vazio', () => {
      const items = [
        { productUuid: '' },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).toThrow(
        new BadRequestException('UUID do produto é obrigatório para todos os itens')
      );
    });

    it('deve lançar BadRequestException quando productUuid é null', () => {
      const items = [
        { productUuid: null as any },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).toThrow(
        new BadRequestException('UUID do produto é obrigatório para todos os itens')
      );
    });

    it('deve lançar BadRequestException quando productUuid contém apenas espaços', () => {
      const items = [
        { productUuid: '   ' },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).toThrow(
        new BadRequestException('UUID do produto é obrigatório para todos os itens')
      );
    });

    it('deve lançar BadRequestException quando productUuid tem formato inválido', () => {
      const items = [
        { productUuid: 'invalid-uuid' },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).toThrow(
        new BadRequestException('UUID do produto deve ter um formato válido para todos os itens')
      );
    });

    it('deve parar na primeira validação que falha', () => {
      const items = [
        { productUuid: '' },
        { productUuid: 'invalid-uuid' },
      ];
      
      expect(() => UuidValidator.validateProductUuids(items)).toThrow(
        new BadRequestException('UUID do produto é obrigatório para todos os itens')
      );
    });
  });
});
