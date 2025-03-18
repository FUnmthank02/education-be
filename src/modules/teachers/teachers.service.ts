import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../configs/prisma/prisma.service';
import { RegisterStudentsDto } from './dto/register-student.dto';
import { extractMentionedEmails } from '../../utils/helpers.util';
import { ReceiveNotificationsDto } from './dto/receive-notifications.dto';
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

  async suspendStudent(studentEmail: string): Promise<void> {
    const student = await this.prisma.student.findUnique({
      where: { email: studentEmail },
    });
    if (!student)
      throw new NotFoundException(ERRORS.STUDENT_NOT_FOUND(studentEmail));

    await this.prisma.student.update({
      where: { email: studentEmail },
      data: { isSuspended: true },
    });
  }

  async retrieveForNotifications(
    dto: ReceiveNotificationsDto,
  ): Promise<string[]> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { email: dto.teacher },
      include: { students: { include: { student: true } } },
    });
    if (!teacher)
      throw new NotFoundException(ERRORS.TEACHER_NOT_FOUND(dto.teacher));

    const mentionedEmails = extractMentionedEmails(dto.notification);
    const registeredStudents = teacher.students
      .filter((ts) => !ts.student.isSuspended)
      .map((ts) => ts.student.email);

    const mentionedStudents = await this.prisma.student.findMany({
      where: { email: { in: mentionedEmails }, isSuspended: false },
      select: { email: true },
    });

    return Array.from(
      new Set([
        ...registeredStudents,
        ...mentionedStudents.map((s) => s.email),
      ]),
    );
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
