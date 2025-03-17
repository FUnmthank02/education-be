import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { PrismaService } from '../../configs/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TeachersService', () => {
  let service: TeachersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
        {
          provide: PrismaService,
          useValue: {
            teacher: { findUnique: jest.fn(), findMany: jest.fn() },
            student: {
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              upsert: jest.fn(),
            },
            teacherStudent: { createMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<TeachersService>(TeachersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test registerStudents
  it('should register students successfully', async () => {
    const dto = {
      teacher: 'teacher@example.com',
      students: ['student1@example.com', 'student2@example.com'],
    };

    // Mock the teacher correctly
    (prisma.teacher.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: dto.teacher, // Ensure the 'email' property is included
    });

    (prisma.student.upsert as jest.Mock)
      .mockResolvedValueOnce({ id: 101, email: 'student1@example.com' })
      .mockResolvedValueOnce({ id: 102, email: 'student2@example.com' });

    (prisma.teacherStudent.createMany as jest.Mock).mockResolvedValue({
      count: 2,
    });

    await service.registerStudents(dto);

    // Check if the Prisma calls were made correctly
    expect(prisma.teacher.findUnique).toHaveBeenCalledWith({
      where: { email: dto.teacher },
    });

    expect(prisma.student.upsert).toHaveBeenCalledTimes(2);
    expect(prisma.teacherStudent.createMany).toHaveBeenCalledWith({
      data: [
        { teacherId: 1, studentId: 101 },
        { teacherId: 1, studentId: 102 },
      ],
      skipDuplicates: true,
    });
  });

  it('should throw NotFoundException if teacher is not found', async () => {
    (prisma.teacher.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.registerStudents({
        teacher: 'invalid@example.com',
        students: [],
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
