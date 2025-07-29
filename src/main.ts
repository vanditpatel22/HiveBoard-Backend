import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { logger } from './common/utils/logger.util';
import { httpLogger } from './common/utils/logger.util';
import { I18nService } from './i18n/i18n.service';


async function bootstrap() {

  try {

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const PORT = process.env.PORT ?? 7001;
    app.use(httpLogger);

    app.enableCors({
      origin: ['http://localhost:3000'], // or your frontend URL(s)
      credentials: true,
    });
 
    await app.listen(PORT);

    logger.info(`Server is running on port ${PORT}`);

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }

}

bootstrap();
