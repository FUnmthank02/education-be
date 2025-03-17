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

  async getCommonStudents(
    teacherEmails: string[],
  ): Promise<{ students: string[] }> {
    if (!teacherEmails.length)
      throw new NotFoundException(ERRORS.NO_TEACHER_PROVIDED);
    const commonStudentIds = await this.findCommonStudentIds(teacherEmails);
    const studentEmails = await this.getStudentEmails(commonStudentIds);
    return { students: studentEmails };
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

  async findCommonStudentIds(teacherEmails: string[]) {
    const teacherStudents = await this.prisma.teacher.findMany({
      where: { email: { in: teacherEmails } },
      include: { students: { select: { studentId: true } } },
    });

    if (teacherStudents.length !== teacherEmails.length) {
      throw new NotFoundException(ERRORS.TEACHER_MISMATCH);
    }

    return teacherStudents
      .map((teacher) => teacher.students.map((s) => s.studentId))
      .reduce((a, b) => a.filter((id) => b.includes(id)));
  }

  async getStudentEmails(studentIds: number[]) {
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { email: true },
    });
    return students.map((s) => s.email);
  }
}
