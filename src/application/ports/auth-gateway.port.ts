import { AuthResponse } from '@domain/entities/auth.entity';

export abstract class AuthGatewayPort {
  abstract login(username: string, password: string): Promise<AuthResponse>;
}
