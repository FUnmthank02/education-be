import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../configs/prisma/prisma.service';
import { RegisterStudentsDto } from './dto/register-student.dto';
import { ERRORS } from '../../utils/constants.util';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async registerStudents(dto: RegisterStudentsDto): Promise<void> {
    const teacher = await this.findTeacherByEmail(dto.teacher);
    const students = await this.findOrCreateStudents(dto.students);

    await this.prisma.teacherStudent.createMany({
      data: students.map((student) => ({
        teacherId: teacher.id,
        studentId: student.id,
      })),
      skipDuplicates: true,
    });
  }

  async findTeacherByEmail(email: string) {
    const teacher = await this.prisma.teacher.findUnique({ where: { email } });
    if (!teacher) throw new NotFoundException(ERRORS.TEACHER_NOT_FOUND(email));
    return teacher;
  }

  async findOrCreateStudents(studentEmails: string[]) {
    return Promise.all(
      studentEmails.map((email) =>
        this.prisma.student.upsert({
          where: { email },
          update: {},
          create: { email },
        }),
      ),
    );
  }
}
