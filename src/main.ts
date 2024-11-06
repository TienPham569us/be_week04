import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './pipes/validate.pipe';
import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  });
  app.use(new LoggerMiddleware().use);
  app.enableCors();
  // global endpoints prefix
  //app.setGlobalPrefix('api/v1');
  // handle all user input validation globally
  //app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(3001);
}
bootstrap();
