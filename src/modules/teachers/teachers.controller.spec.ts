import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { PrismaService } from '../../configs/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { TeachersController } from './teachers.controller';

describe('TeachersService', () => {
  let controller: TeachersController;
  let service: TeachersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
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
            registerStudents: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            retrieveForNotifications: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<TeachersController>(TeachersController);
    service = module.get<TeachersService>(TeachersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call registerStudents', async () => {
    const dto = {
      teacher: 'teacher@example.com',
      students: ['student1@example.com'],
    };

    jest.spyOn(service, 'registerStudents').mockResolvedValue(undefined);

    await controller.registerStudents(dto);

    expect(service.registerStudents).toHaveBeenCalledWith(dto);
  });

  it('should call getCommonStudents', async () => {
    jest.spyOn(service, 'getCommonStudents').mockResolvedValue({
      students: ['student1@example.com'],
    });

    const result = await service.getCommonStudents(['teacher@example.com']);

    expect(result).toEqual({ students: ['student1@example.com'] });
    expect(service.getCommonStudents).toHaveBeenCalledWith([
      'teacher@example.com',
    ]);
  });
  it('should call suspendStudent', async () => {
    jest.spyOn(service, 'suspendStudent').mockResolvedValue(undefined);

    await controller.suspendStudent({ student: 'student@example.com' });

    expect(service.suspendStudent).toHaveBeenCalledWith('student@example.com');
  });

  it('should call retrieveForNotifications', async () => {
    const dto = {
      teacher: 'teacher@example.com',
      notification: 'Hello @student@example.com',
    };

    jest
      .spyOn(service, 'retrieveForNotifications')
      .mockResolvedValue(['student@example.com']);

    const result = await controller.retrieveForNotifications(dto);

    expect(result).toEqual(['student@example.com']);
    expect(service.retrieveForNotifications).toHaveBeenCalledWith(dto);
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

  // Test getCommonStudents
  it('should return common students', async () => {
    (prisma.teacher.findMany as jest.Mock).mockResolvedValue([
      {
        id: 1,
        students: [{ studentId: 101 }],
      },
      {
        id: 2,
        students: [{ studentId: 101 }],
      },
    ]);

    (prisma.student.findMany as jest.Mock).mockResolvedValue([
      { id: 101, email: 'common@student.com' },
    ]);

    const result = await service.getCommonStudents([
      'teacher1@example.com',
      'teacher2@example.com',
    ]);

    expect(result).toEqual({ students: ['common@student.com'] });

    expect(prisma.teacher.findMany).toHaveBeenCalledWith({
      where: {
        email: { in: ['teacher1@example.com', 'teacher2@example.com'] },
      },
      include: { students: { select: { studentId: true } } },
    });

    expect(prisma.student.findMany).toHaveBeenCalledWith({
      where: { id: { in: [101] } },
      select: { email: true },
    });
  });

  it('should call getCommonStudents and return result', async () => {
    const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
    const expectedResult = {
      students: ['student1@example.com', 'student2@example.com'],
    };

    jest.spyOn(service, 'getCommonStudents').mockResolvedValue(expectedResult);

    const result = await controller.getCommonStudents({
      teacher: teacherEmails,
    });

    expect(service.getCommonStudents).toHaveBeenCalledWith(teacherEmails);
    expect(result).toEqual(expectedResult);
  });

  it('should throw NotFoundException if no teachers provided', async () => {
    await expect(service.getCommonStudents([])).rejects.toThrow(
      NotFoundException,
    );
  });

  // Test suspendStudent
  it('should suspend student successfully', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({
      email: 'student@example.com',
      isSuspended: false,
    });

    await service.suspendStudent('student@example.com');

    expect(prisma.student.update).toHaveBeenCalledWith({
      where: { email: 'student@example.com' },
      data: { isSuspended: true },
    });
  });

  it('should throw NotFoundException if student is not found', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.suspendStudent('nonexistent@example.com'),
    ).rejects.toThrow(NotFoundException);
  });

  // Test retrieveForNotifications
  it('should retrieve students for notifications', async () => {
    const dto = {
      teacher: 'teacher@example.com',
      notification: 'Hello @student1@example.com',
    };

    (prisma.teacher.findUnique as jest.Mock).mockResolvedValue({
      email: 'teacher@example.com',
      students: [
        { student: { email: 'registered@student.com', isSuspended: false } },
      ],
    });

    (prisma.student.findMany as jest.Mock).mockResolvedValue([
      { email: 'student1@example.com' },
    ]);

    const result = await service.retrieveForNotifications(dto);

    expect(result).toEqual(
      expect.arrayContaining([
        'registered@student.com',
        'student1@example.com',
      ]),
    );
  });

  it('should throw NotFoundException if teacher is not found', async () => {
    (prisma.teacher.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      service.retrieveForNotifications({
        teacher: 'unknown@example.com',
        notification: '',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
