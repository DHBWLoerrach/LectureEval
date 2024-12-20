import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { QuestionType } from '~/enums/QuestionType'
import { roundToTwoDigits } from '~/helpers/roundToTwoDigits'
import { useCourseAssignmentsByLectureQuery } from '~/queries/CourseAssignments/useCourseAssignmentsByLectureQuery'
import { useFormValuesByAssignmentsQuery } from '~/queries/FormValues/useFormValuesByAssignmentsQuery'
import { useUpsertLectureMutation } from '~/queries/Lectures/useUpsertLectureMutation'
import { useQuestionsByIDQuery } from '~/queries/Questions/useQuestionsByIDQuery'
import { translations } from '~/translations/translations'
import { Lecture } from '~/types/Lecture'

type Props = {
    lecture: Lecture
}

/**
 * Updates the overall-rating and difficulty-rating in the LecuresView:
 *  Calculates the overall-rating based on the average of all related ratings of QuestionType.Result
 *  Calculates the difficulty based on the average of all related ratings of QuestionType.Difficulty
 *  Saves the updated Value in the Lectures Table.
 */
export const useUpdateLectureRating = () => {
    const intl = useIntl()

    const [lecture, setLecture] = useState<Lecture>()

    const { data: assignments, error: assignmentsError } = useCourseAssignmentsByLectureQuery({
        lectureID: lecture?.id,
    })
    const { data: formValues, error: valuesError } = useFormValuesByAssignmentsQuery({
        courseAssignmentIDs: assignments?.map((a) => a.id),
    })

    const { mutate: updateLecture } = useUpsertLectureMutation()

    const questionIDs = useMemo(() => {
        const ids = formValues?.map((f) => f.questionID) ?? []

        return [...new Set(ids)]
    }, [formValues])

    const { data: questions } = useQuestionsByIDQuery({ questionIDs })

    const questionTypeMap = useMemo(
        () => new Map(questions?.map((q) => [q.id, q.typeID])) as Map<number, QuestionType>,
        [questions],
    )

    const getAverageByQuestionType = useCallback(
        (type: QuestionType) => {
            if (!formValues || !questions) return undefined

            const typeValues = formValues.filter((f) => questionTypeMap.get(f.questionID) === type)

            const typeSum = typeValues.reduce((acc, formValue) => {
                return acc + parseInt(formValue.value)
            }, 0)

            return roundToTwoDigits(typeSum / typeValues.length)
        },
        [formValues, questionTypeMap, questions],
    )

    const error = useMemo(() => assignmentsError ?? valuesError, [assignmentsError, valuesError])

    useEffect(() => {
        if (!error) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )

        console.error(error.message)
    }, [error, intl])

    useEffect(() => {
        if (!questions || !formValues || !lecture) return

        const rating = getAverageByQuestionType(QuestionType.Result)
        const difficulty = getAverageByQuestionType(QuestionType.Difficulty)

        updateLecture(
            {
                ...lecture,
                rating: rating ?? lecture.rating,
                difficulty: difficulty ?? lecture.difficulty,
            },
            {
                onSettled: () => {
                    setLecture(undefined)
                },
            },
        )
    }, [formValues, getAverageByQuestionType, lecture, questions, updateLecture])

    return useCallback(({ lecture }: Props) => setLecture(lecture), [setLecture])
}
