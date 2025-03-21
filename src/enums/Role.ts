/**
 * Available roles for the application.
 * Needs to match the roles in the database.
 *
 * Should always be the preferred way to check for a user's role.
 */
export enum Role {
  Admin = 'Admin',
  Lecturer = 'Lecturer',
  Student = 'Student',
}
