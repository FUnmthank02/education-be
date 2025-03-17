import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GlobalErrorHandler } from './common/filters/error-handler.filter';
import { CustomValidationPipe } from './common/pipes/customize-validation.pipe';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new GlobalErrorHandler());
  await app
    .listen(process.env.PORT ?? 8888)
    .then(() =>
      console.log(`Server started on port ${process.env.PORT ?? 8888}`),
    )
    .catch((err) => console.error(`Server failed to start: ${err}`));
}
main();
