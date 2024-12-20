/**
 * This enum is an exact copy of the questionType table in the database.
 * This should be controlled by a database seeder or migration and never by changed manually.
 */
export enum QuestionType {
    /**
     * Represents a standard Star Rating Question.
     */
    Rating = 1,
    /**
     * Represents a question with a free text field.
     */
    Text = 2,
    /**
     * Represents the difficulty rating for the course.
     */
    Difficulty = 3,
    /**
     * Represents the overall rating for the course
     */
    Result = 4,
}
