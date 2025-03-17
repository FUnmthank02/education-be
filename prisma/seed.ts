import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Teachers
  const teacher1 = await prisma.teacher.create({
    data: { email: 'teacher1@example.com' },
  });

  const teacher2 = await prisma.teacher.create({
    data: { email: 'teacher2@example.com' },
  });

  // Create Students
  const student1 = await prisma.student.create({
    data: { email: 'student1@example.com' },
  });

  const student2 = await prisma.student.create({
    data: { email: 'student2@example.com' },
  });

  const student3 = await prisma.student.create({
    data: { email: 'student3@example.com', isSuspended: true },
  });

  // Associate Students with Teachers
  await prisma.teacherStudent.createMany({
    data: [
      { teacherId: teacher1.id, studentId: student1.id },
      { teacherId: teacher1.id, studentId: student2.id },
      { teacherId: teacher2.id, studentId: student2.id },
      { teacherId: teacher2.id, studentId: student3.id },
    ],
  });

  console.log('Seeding completed successfully!');
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error('Error seeding database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
