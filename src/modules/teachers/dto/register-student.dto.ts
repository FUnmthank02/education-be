import { IsEmail, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class RegisterStudentsDto {
  @IsEmail({}, { message: 'Teacher email must be a valid email address' })
  @IsNotEmpty({ message: 'Teacher email is required' })
  teacher: string;

  @IsArray({ message: 'Students must be an array' })
  @ArrayNotEmpty({ message: 'Students list cannot be empty' })
  @IsEmail(
    {},
    { each: true, message: 'Each student email must be a valid email address' },
  )
  students: string[];
}
