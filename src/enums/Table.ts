/**
 * Contains all available database tables inside the public schema.
 *
 * Should always be the preferred way to access the database since it decreases the chance of spelling errors.
 */
export enum Table {
  CourseAssignments = 'course_assignments',
  Courses = 'courses',
  Departments = 'departments',
  FormValues = 'form_values',
  Forms = 'forms',
  Lecturers = 'lecturers',
  Lectures = 'lectures',
  Locations = 'locations',
  PendingRatings = 'pending_ratings',
  Questions = 'questions',
  QuestionTypes = 'question_types',
  Roles = 'roles',
  Steps = 'steps',
  Students = 'students',
  UserLocations = 'user_locations',
  UserRoles = 'user_roles',
  Semesters = 'semesters',
}
