import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useAuth } from '~/context/AuthContext'
import { useDialog } from '~/context/DialogContext'
import { useSnackbar } from '~/context/SnackbarContext'
import { Route } from '~/enums/Route'
import { LectureAssignment } from '~/queries/CourseAssignments/useAssignedLecturesForCourseQuery'
import { useDepartmentQuery } from '~/queries/Departments/useDepartmentQuery'
import { useInsertFormValueMutation } from '~/queries/FormValues/useUpsertFormValue'
import { useDeletePendingRatingMutation } from '~/queries/PendingRatings/useDeletePendingRatingMutation'
import { useStepsForFormQuery } from '~/queries/Steps/useStepsForFormQuery'
import { useStudentByUserQuery } from '~/queries/Students/useStudentByUserQuery'
import { translations } from '~/translations/translations'
import { Step } from '~/types/Step'
import { useUpdateLectureRating } from '~/views/Forms/hooks/useUpdateLectureRating'

type Props = {
    assignment: LectureAssignment
}

type FormData = Record<string, string>

export const useStepLogic = ({ assignment }: Props) => {
    const intl = useIntl()
    const showDialog = useDialog()
    const showSnackbar = useSnackbar()
    const { session } = useAuth()
    const updateLectureRating = useUpdateLectureRating()
    const [activeStep, setActiveStep] = useState<Step>()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    const {
        data: department,
        isLoading: departmentLoading,
        error: departmentError,
    } = useDepartmentQuery({
        departmentId: assignment.form.departmentID,
    })

    const {
        data: steps,
        isLoading: stepsLoading,
        error: stepsError,
    } = useStepsForFormQuery({
        formId: assignment.form.id,
    })

    const {
        data: student,
        isLoading: studentLoading,
        error: studentError,
    } = useStudentByUserQuery({
        userID: session?.user.id,
    })

    const { mutate: saveValue, error: insertError } = useInsertFormValueMutation()

    const { mutate: deletePendingRating, error: deletePendingError } =
        useDeletePendingRatingMutation()

    const maxSerial = useMemo(() => {
        return (
            steps?.reduce((max, step) => {
                if (step.serial < max) return max

                return step.serial
            }, 0) ?? 0
        )
    }, [steps])

    const onNext = useCallback(() => {
        if (!activeStep) {
            setActiveStep(steps?.find((s) => s.serial === 1))
            return
        }

        setActiveStep(steps?.find((s) => s.serial === activeStep.serial + 1))
    }, [activeStep, steps])
    const onPrev = useCallback(() => {
        if (!activeStep) return

        setActiveStep(steps?.find((s) => s.serial === activeStep.serial - 1))
    }, [activeStep, steps])

    /**
     * Saves value of each Question to FromValues table.
     * Updates the averall rating and the difficulty rating in the Lecture View.
     * Deletes the Pending Rating from DB.
     * Shows message when saved.
     */
    const onSaveForm = useCallback(
        (data: FormData) => {
            if (!student) return

            saveValue(
                Object.entries(data)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, value]) => !!value)
                    .map(([key, value]) => ({
                        questionID: parseInt(key),
                        value: `${value}`,
                        courseAssignmentID: assignment.id,
                    })),
                {
                    onSuccess: () => {
                        updateLectureRating({ lecture: assignment.lecture })

                        deletePendingRating({
                            courseAssignmentId: assignment.id,
                            studentId: student.id,
                        })

                        showSnackbar({
                            text: intl.formatMessage(translations.formSaved),
                        })
                        navigation.navigate(Route.Start)
                    },
                },
            )
        },
        [
            assignment,
            deletePendingRating,
            intl,
            navigation,
            saveValue,
            showSnackbar,
            student,
            updateLectureRating,
        ],
    )

    const onSubmit = useCallback(
        (data: FormData) => {
            showDialog({
                title: intl.formatMessage(translations.saveFormTitle),
                description: intl.formatMessage(translations.saveFormDescription),
                onAccept: () => onSaveForm(data),
            })
        },
        [intl, onSaveForm, showDialog],
    )

    useEffect(() => {
        if (!activeStep || !steps) return

        setActiveStep(steps.find((step) => step.serial === activeStep.serial))
    }, [activeStep, steps])

    const error = useMemo(
        () => departmentError ?? stepsError ?? studentError ?? insertError ?? deletePendingError,
        [deletePendingError, departmentError, insertError, stepsError, studentError],
    )

    useEffect(() => {
        if (!error) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )

        console.error(error.message)
    }, [error, intl])

    return {
        steps,
        maxSerial,
        isLoading: stepsLoading || departmentLoading || studentLoading,
        activeStep,
        department,
        onNext,
        onPrev,
        onSubmit,
    }
}
