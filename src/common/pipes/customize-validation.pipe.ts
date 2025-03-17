import {
  Injectable,
  ValidationPipe,
  ValidationError,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true, // Automatically transform request payloads to DTOs
      whitelist: true, // Remove unknown properties from the request
      forbidNonWhitelisted: true, // Throw error when unknown properties are sent
      exceptionFactory: (errors: ValidationError[]) => {
        // Extract validation error messages
        const messages = errors.map((err) =>
          Object.values(err.constraints || {}).join(', '),
        );
        const statusCode = HttpStatus.BAD_REQUEST;
        return new HttpException(messages, statusCode);
      },
    });
  }
}
