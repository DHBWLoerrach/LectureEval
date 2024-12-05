import { useCallback, useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { QuestionType } from '~/enums/QuestionType'
import { convertToFiveStars } from '~/helpers/convertToFiveStars'
import { useFormValuesByAssignmentQuery } from '~/queries/FormValues/useFormValuesByAssignmentQuery'
import { useQuestionsByIDQuery } from '~/queries/Questions/useQuestionsByIDQuery'
import { translations } from '~/translations/translations'
import { useDetailsFilterLogic } from '~/views/Detail/hooks/useDetailsFilterLogic'

export const useDetailsLogic = (courseAssignmentID: number) => {
    const intl = useIntl()

    const {
        data: formValues,
        isLoading: formValuesLoading,
        error: formValuesError,
    } = useFormValuesByAssignmentQuery({ courseAssignmentID })

    const questionIDs = useMemo(
        () => formValues?.map((formValue) => formValue.questionID),
        [formValues],
    )

    const {
        data: questions,
        isLoading: questionsLoading,
        error: questionsError,
    } = useQuestionsByIDQuery({ questionIDs })

    const groupedByQuestion = useMemo(() => {
        if (!formValues || !questions) return {}

        return formValues?.reduce(
            (acc, formValue) => {
                if (typeof questions !== 'undefined') {
                    if (!acc[formValue.questionID]) {
                        acc[formValue.questionID] = []
                    }
                    acc[formValue.questionID].push(formValue.value)
                }
                return acc
            },
            {} as Record<string, string[]>,
        )
    }, [formValues, questions])

    const getFormValueAverages = useCallback(
        (questionType: QuestionType) => {
            return Object.fromEntries(
                Object.entries(groupedByQuestion).map(([questionID, values]) => {
                    const intValues = values
                        .map((value) => parseInt(value, 10))
                        .filter((num) => !isNaN(num))

                    const average =
                        intValues.length > 0
                            ? questionType === QuestionType.Rating
                                ? convertToFiveStars(
                                      intValues.reduce((sum, num) => sum + num, 0) /
                                          intValues.length,
                                  )
                                : intValues.reduce((sum, num) => sum + num, 0) / intValues.length
                            : null

                    return [questionID, average ?? intl.formatMessage(translations.notSet)]
                }),
            )
        },
        [groupedByQuestion, intl],
    )

    const ratingAverages = useMemo(
        () => getFormValueAverages(QuestionType.Rating),
        [getFormValueAverages],
    )
    const difficultyAverages = useMemo(
        () => getFormValueAverages(QuestionType.Difficulty),
        [getFormValueAverages],
    )

    const questionFormValues = useMemo(() => {
        return Object.fromEntries(
            Object.entries(groupedByQuestion).map(([questionID, values]) => {
                return [questionID, values]
            }),
        )
    }, [groupedByQuestion])

    const { searchedDetails, search, setSearch } = useDetailsFilterLogic({
        questions: questions ?? [],
    })

    const error = useMemo(
        () => formValuesError ?? questionsError,
        [formValuesError, questionsError],
    )

    useEffect(() => {
        if (!error) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )

        console.error(error.message)
    }, [error, intl])

    const isLoading = useMemo(
        () => formValuesLoading || questionsLoading,
        [formValuesLoading, questionsLoading],
    )

    return {
        isLoading,
        searchedDetails,
        search,
        setSearch,
        ratingAverages,
        difficultyAverages,
        questionFormValues,
    }
}
