import { BadRequestException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';

export class UuidValidator {
  /**
   * Valida se o UUID fornecido é válido
   * @param uuid - O UUID a ser validado
   * @param fieldName - Nome do campo para personalizar a mensagem de erro
   * @throws BadRequestException se o UUID for inválido
   */
  static validate(uuid: string, fieldName: string = 'UUID'): void {
    if (!uuid?.trim()) {
      throw new BadRequestException(`${fieldName} é obrigatório`);
    }

    if (!isUuid(uuid)) {
      throw new BadRequestException(`${fieldName} deve ter um formato válido`);
    }
  }

  /**
   * Valida múltiplos UUIDs
   * @param uuids - Array de objetos com uuid e fieldName
   * @throws BadRequestException se algum UUID for inválido
   */
  static validateMultiple(uuids: Array<{ uuid: string; fieldName: string }>): void {
    uuids.forEach(({ uuid, fieldName }) => {
      this.validate(uuid, fieldName);
    });
  }

  /**
   * Valida UUID de produto em uma lista de itens
   * @param items - Array de itens que possuem productUuid
   * @throws BadRequestException se algum productUuid for inválido
   */
  static validateProductUuids(items: Array<{ productUuid: string }>): void {
    if (!items || items.length === 0) {
      return;
    }

    items.forEach(item => {
      if (!item.productUuid?.trim()) {
        throw new BadRequestException('UUID do produto é obrigatório para todos os itens');
      }
      
      if (!isUuid(item.productUuid)) {
        throw new BadRequestException('UUID do produto deve ter um formato válido para todos os itens');
      }
    });
  }
}
