export const ERRORS = {
  TEACHER_NOT_FOUND: (email: string) => `Teacher with email ${email} not found`,
  NO_TEACHER_PROVIDED: 'At least one teacher email must be provided',
  TEACHER_MISMATCH: 'One or more teachers not found',
};
