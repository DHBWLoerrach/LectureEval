/**
 * This enum is an exact copy of the questionType table in the database.
 * This should be controlled by a database seeder or migration and never by changed manually.
 */
export enum QuestionType {
    Rating = 1,
    Text = 2,
}
