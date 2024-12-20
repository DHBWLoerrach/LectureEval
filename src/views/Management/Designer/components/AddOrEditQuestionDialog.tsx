import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'
import Button from '~/components/Button'
import SelectMenu from '~/components/SelectMenu'
import SwitchInput from '~/components/SwitchInput'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { getQuestionTypeTranslation } from '~/helpers/getQuestionTypeTranslation'
import { useQuestionTypesQuery } from '~/queries/QuestionTypes/useQuestionTypesQuery'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Question } from '~/types/Question'
import { QuestionFormData } from '~/views/Management/Designer/types/QuestionFormData'

export type QuestionEditInfo = {
    stepId: number
    serial: number
    question?: Question
}

type Props = {
    editInfo: QuestionEditInfo
    onClose: () => void
    onSave: (question: Question) => void
}

const styles = StyleSheet.create({
    content: { gap: 10 },
})

const AddOrEditQuestionDialog = ({ editInfo, onClose, onSave }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const { data: questionTypes } = useQuestionTypesQuery()

    const title = useMemo(
        () => (editInfo.question ? 'Frage bearbeiten' : 'Frage hinzufügen'),
        [editInfo],
    )

    const form = useForm<QuestionFormData>({
        defaultValues: {
            ...editInfo.question,
            serial: editInfo.serial,
            stepID: editInfo.stepId,
            isRequired: editInfo.question?.isRequired ?? false,
        },
    })
    const {
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    useEffect(() => {
        if (!isDirty) return

        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

    const typeOptions = useMemo(
        () =>
            questionTypes?.map((type) => {
                return {
                    value: type.id,
                    label: getQuestionTypeTranslation(type.id, intl),
                }
            }) ?? [],
        [intl, questionTypes],
    )

    return (
        <Portal>
            <FormProvider {...form}>
                <Dialog
                    visible
                    onDismiss={onClose}
                    style={globalStyles.dialog}
                >
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content style={styles.content}>
                        <TextInput
                            label={intl.formatMessage(translations.question)}
                            name='question'
                            rules={{
                                required: intl.formatMessage(translations.required),
                            }}
                        />
                        <SelectMenu
                            label={intl.formatMessage(translations.questionType)}
                            name='typeID'
                            options={typeOptions}
                            rules={{
                                required: intl.formatMessage(translations.required),
                            }}
                        />
                        <SwitchInput
                            label={intl.formatMessage(translations.required)}
                            name='isRequired'
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>{intl.formatMessage(translations.cancel)}</Button>
                        <Button
                            disabled={!isDirty}
                            onPress={handleSubmit(onSave)}
                        >
                            {intl.formatMessage(translations.save)}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </FormProvider>
        </Portal>
    )
}

export default AddOrEditQuestionDialog
