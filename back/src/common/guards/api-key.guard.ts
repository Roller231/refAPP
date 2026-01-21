import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const apiKey = this.configService.get<string>('API_KEY', '');
    if (!apiKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const providedHeader = request.headers['x-api-key'];
    const provided = Array.isArray(providedHeader)
      ? providedHeader[0]
      : providedHeader;
    return typeof provided === 'string' && provided.trim() === apiKey;
  }
}
