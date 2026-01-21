import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {


  console.log('BOOTSTRAP: start');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors();
  app.useLogger(new Logger());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log('BOOTSTRAP: app created');


  const swaggerConfig = new DocumentBuilder()
    .setTitle('Beasmart Miniapp API')
    .setDescription('Backend API for Telegram mini app')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .addSecurityRequirements('api-key')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDoc);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3001);

  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
