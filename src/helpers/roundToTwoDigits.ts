/**
 * Function to round a rating to 2 decimal places to avoid precision errors
 */
export const roundToTwoDigits = (rating: number) => {
    return Math.round(rating * 100) / 100
}
