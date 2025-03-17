import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RegisterStudentsDto } from './dto/register-student.dto';

@Controller('api')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post('register')
  @HttpCode(204)
  async registerStudents(@Body() dto: RegisterStudentsDto) {
    await this.teachersService.registerStudents(dto);
  }
}
