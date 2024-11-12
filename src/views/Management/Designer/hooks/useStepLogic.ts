import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert } from 'react-native'
import { useDialog } from '~/context/DialogContext'
import { useSnackbar } from '~/context/SnackbarContext'
import { useDepartmentQuery } from '~/queries/Departments/useDepartmentQuery'
import { useDeleteStepMutation } from '~/queries/Steps/useDeleteStepMutation'
import { useStepsForFormQuery } from '~/queries/Steps/useStepsForFormQuery'
import { useUpsertStepMutation } from '~/queries/Steps/useUpsertStepMutation'
import { translations } from '~/translations/translations'
import { Step } from '~/types/Step'
import { StepEditInfo } from '~/views/Management/Designer/components/AddOrEditStepDialog'
import { StepFormData } from '~/views/Management/Designer/types/StepFormData'

type Props = {
    formId: number
    departmentId: number
}

export const useStepLogic = ({ departmentId, formId }: Props) => {
    const intl = useIntl()

    const showDialog = useDialog()
    const showSnackbar = useSnackbar()

    const [activeStep, setActiveStep] = useState<Step>()
    const [editInfo, setEditInfo] = useState<StepEditInfo>()

    const { mutate: saveStep } = useUpsertStepMutation()
    const { mutate: deleteStep } = useDeleteStepMutation()

    const { data: department, isLoading: departmentLoading } = useDepartmentQuery({ departmentId })

    const {
        data: steps,
        isLoading: stepsLoading,
        refetch: refetchSteps,
    } = useStepsForFormQuery({ formId })

    const maxSerial = useMemo(() => {
        return (
            steps?.reduce((max, step) => {
                if (step.serial < max) return max

                return step.serial
            }, 0) ?? 0
        )
    }, [steps])

    const onAdd = useCallback(() => {
        setEditInfo({
            formId,
            serial: (activeStep?.serial ?? 0) + 1,
        })
    }, [activeStep?.serial, formId])

    const onEdit = useCallback(
        (step: Step) => {
            setEditInfo({ step, formId, serial: step.serial })
        },
        [formId],
    )

    const onDelete = useCallback(
        (step: Step) => {
            showDialog({
                title: intl.formatMessage(translations.deleteEntityHeader, {
                    entity: intl.formatMessage(translations.stepLabel),
                }),
                description: intl.formatMessage(translations.deleteEntityDescription, {
                    name: step.title,
                }),
                onAccept: () =>
                    deleteStep(step.id, {
                        onSuccess: () => {
                            refetchSteps()
                            setActiveStep(steps?.find((s) => s.serial === step.serial - 1))
                            showSnackbar({
                                text: intl.formatMessage(translations.entityDeleted, {
                                    article: intl.formatMessage(translations.maleArticle),
                                    entity: intl.formatMessage(translations.stepLabel),
                                }),
                            })
                        },
                        onError: (error) => {
                            Alert.alert(
                                intl.formatMessage(translations.error),
                                intl.formatMessage(translations.errorDescription),
                            )
                            console.error(
                                `Unexpected error while deleting a form: ${error.message}`,
                            )
                        },
                    }),
            })
        },
        [deleteStep, intl, refetchSteps, showDialog, showSnackbar, steps],
    )

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

    const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo])

    const onSave = useCallback(
        (data: StepFormData) => {
            saveStep(data, {
                onSuccess: () => {
                    refetchSteps()
                    showSnackbar({
                        text: editInfo?.step?.id
                            ? intl.formatMessage(translations.changesSaved)
                            : intl.formatMessage(translations.entityCreated, {
                                  article: intl.formatMessage(translations.maleArticle),
                                  entity: intl.formatMessage(translations.stepLabel),
                              }),
                    })
                },
                onError: (error) => {
                    Alert.alert(
                        intl.formatMessage(translations.error),
                        intl.formatMessage(translations.errorDescription),
                    )
                    console.error(`Unexpected error while saving a form: ${error.message}`)
                },
            })
            onClose()
        },
        [saveStep, onClose, refetchSteps, showSnackbar, editInfo?.step?.id, intl],
    )

    useEffect(() => {
        if (!activeStep || !steps) return

        setActiveStep(steps.find((step) => step.serial === activeStep.serial))
    }, [activeStep, steps])

    return {
        steps,
        editInfo,
        maxSerial,
        isLoading: stepsLoading || departmentLoading,
        activeStep,
        department,
        onAdd,
        onEdit,
        onNext,
        onPrev,
        onSave,
        onClose,
        onDelete,
    }
}
