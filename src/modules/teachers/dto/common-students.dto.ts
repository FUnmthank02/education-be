/* istanbul ignore file */
import { IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class CommonStudentsQueryDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one teacher must be provided' })
  @IsEmail({}, { each: true, message: 'Each teacher must be a valid email' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value])) // Convert single string to array
  teacher: string[];
}
