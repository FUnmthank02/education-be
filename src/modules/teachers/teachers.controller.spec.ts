import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { RegisterStudentsDto } from './dto/register-student.dto';
import { CommonStudentsQueryDto } from './dto/common-students.dto';
import { SuspendStudentDto } from './dto/suspend-student.dto';
import { NotFoundException } from '@nestjs/common';

describe('TeachersController', () => {
  let controller: TeachersController;
  let teachersService: TeachersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: TeachersService,
          useValue: {
            registerStudents: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            retrieveForNotifications: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    teachersService = module.get<TeachersService>(TeachersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerStudents', () => {
    it('should call registerStudents and return 204 No Content', async () => {
      const dto: RegisterStudentsDto = {
        teacher: 'teacher@example.com',
        students: ['student1@example.com', 'student2@example.com'],
      };

      (teachersService.registerStudents as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(controller.registerStudents(dto)).resolves.toBeUndefined();

      expect(teachersService.registerStudents).toHaveBeenCalledWith(dto);
      expect(teachersService.registerStudents).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if teacher is not found', async () => {
      const dto: RegisterStudentsDto = {
        teacher: 'invalid-email',
        students: ['student1@example.com'],
      };

      (teachersService.registerStudents as jest.Mock).mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.registerStudents(dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(teachersService.registerStudents).toHaveBeenCalledWith(dto);
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students', async () => {
      const query: CommonStudentsQueryDto = {
        teacher: ['teacher1@example.com', 'teacher2@example.com'],
      };

      const expectedResponse = { students: ['common@student.com'] };

      (teachersService.getCommonStudents as jest.Mock).mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.getCommonStudents(query);
      expect(result).toEqual(expectedResponse);

      expect(teachersService.getCommonStudents).toHaveBeenCalledWith(
        query.teacher,
      );
      expect(teachersService.getCommonStudents).toHaveBeenCalledTimes(1);
    });
  });

  describe('suspendStudent', () => {
    it('should call suspendStudent and return 204 No Content', async () => {
      const dto: SuspendStudentDto = { student: 'student@example.com' };

      (teachersService.suspendStudent as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(controller.suspendStudent(dto)).resolves.toBeUndefined();

      expect(teachersService.suspendStudent).toHaveBeenCalledWith(dto.student);
      expect(teachersService.suspendStudent).toHaveBeenCalledTimes(1);
    });
  });
});
