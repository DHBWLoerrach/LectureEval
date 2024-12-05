export const convertToFiveStars = (rating: number) => {
    const scaled = (rating - 1) * 0.8 + 1

    return Math.round(scaled * 100) / 100
}
