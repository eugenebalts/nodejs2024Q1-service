import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiSpec = readFileSync(join(__dirname, '../doc/api.yaml'), 'utf-8');
  const config = parse(apiSpec);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
