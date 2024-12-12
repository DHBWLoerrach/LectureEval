/**
 * This enum is an exact copy of the questionType table in the database.
 * This should be controlled by a database seeder or migration and never by changed manually.
 *
 * Rating:      represents a standard Star Rating Question.
 * Text:        represents a question with a free text field.
 * Difficulty:  represents the difficulty rating for the course.
 * Result:      represents the overall rating for the course.
 */
export enum QuestionType {
    Rating = 1,
    Text = 2,
    Difficulty = 3,
    Result = 4,
}
