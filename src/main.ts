import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JsonResponseExceptionFilter } from './commons/exception-filters';
import { JsonStatusCodeInterceptor } from './commons/interceptors';

const { APP_PORT } = process.env;

function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Backend Test API')
    .setDescription('API Backe End Test Eigen')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  app.useGlobalFilters(new JsonResponseExceptionFilter());
  app.useGlobalInterceptors(new JsonStatusCodeInterceptor());
  app.enableCors();
  app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
  addSwagger(app);

  app.listen(+APP_PORT, () => console.log(`app start at port ${APP_PORT}`));
}

bootstrap();
