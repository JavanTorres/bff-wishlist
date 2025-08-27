import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpMethodEnum } from '@application/enums/http-method.enum';
import { AuthGatewayPort } from '@application/ports/auth-gateway.port';
import { AuthResponse } from '@domain/entities/auth.entity';

import { HttpBffGateway } from './http.gateway';

@Injectable()
export class AuthGateway extends HttpBffGateway implements AuthGatewayPort {
  private readonly apiUrl: string;

  constructor(
    httpService: HttpService,
    private configService: ConfigService,
  ) {
    super(httpService);
    this.apiUrl = this.configService.get<string>('API_WISHLIST_URL') as string;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.gatewayHandler(
      '/auth/login',
      HttpMethodEnum.POST,
      { username, password },
      this.apiUrl,
      {},
      false
    );
    
    return new AuthResponse(response.accessToken, response.refreshToken);
  }
}
