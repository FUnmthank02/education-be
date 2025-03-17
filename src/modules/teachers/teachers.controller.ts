import { Controller, Get, Post, Body, HttpCode, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RegisterStudentsDto } from './dto/register-student.dto';
import { CommonStudentsQueryDto } from './dto/common-students.dto';

@Controller('api')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post('register')
  @HttpCode(204)
  async registerStudents(@Body() dto: RegisterStudentsDto) {
    await this.teachersService.registerStudents(dto);
  }

  @Get('commonstudents')
  async getCommonStudents(@Query() query: CommonStudentsQueryDto) {
    return await this.teachersService.getCommonStudents(query.teacher);
  }
}
