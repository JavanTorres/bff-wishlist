import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { HttpMethodEnum } from '@application/enums/http-method.enum';

import { HttpErrorHandler } from './http-error-handler';

export abstract class HttpBffGateway {
  protected readonly logger = new Logger(HttpBffGateway.name);

  constructor(protected readonly httpService: HttpService) { }

  async gatewayHandler(
    url: string,
    method: HttpMethodEnum,
    data: any = {},
    host: string,
    headers: Record<string, string> | null = {},
    detailedResponse: boolean = true,
  ): Promise<any> {
    const urlHost = `${host}${url}`;
    this.logger.log(`${method} ${urlHost}`);

    try {
      const response = await this.request(urlHost, method, data, headers);
      return detailedResponse ? response : response.data;
    } catch (error) {
      throw new HttpErrorHandler(
        error,
        false,
        'Erro ao realizar a solicitação para o microserviço.',
      );
    }
  }

  private async request(url: string, method: HttpMethodEnum, data: any = {}, headers: Record<string, string> | null = {}) {
    const config = { headers: { ...headers } };

    switch (method) {
      case HttpMethodEnum.GET:
        return firstValueFrom(this.httpService.get(url, config));
      case HttpMethodEnum.POST:
        return firstValueFrom(this.httpService.post(url, data, config));
      case HttpMethodEnum.PUT:
        return firstValueFrom(this.httpService.put(url, data, config));
      case HttpMethodEnum.PATCH:
        return firstValueFrom(this.httpService.patch(url, data, config));
      case HttpMethodEnum.DELETE:
        return firstValueFrom(this.httpService.delete(url, config));
      default:
        throw new Error('Método HTTP Inválido.');
    }
  }
}
