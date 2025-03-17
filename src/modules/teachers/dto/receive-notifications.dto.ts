import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReceiveNotificationsDto {
  @IsEmail({}, { message: 'Teacher email must be a valid email address' })
  @IsNotEmpty({ message: 'Teacher email is required' })
  teacher: string;

  @IsNotEmpty({ message: 'Notification text is required' })
  notification: string;
}
