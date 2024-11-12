import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { Divider, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import LoadingSpinner from '~/components/LoadingSpinner'
import StarsInput from '~/components/StarsInput'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { QuestionType } from '~/enums/QuestionType'
import { useDeepLTranslationMutation } from '~/queries/DeepL/useDeepLTranslationMutation'
import { translations } from '~/translations/translations'
import { Question as TQuestion } from '~/types/Question'

type Props = {
    question: TQuestion
    onEdit: (question: TQuestion) => void
    onDelete: (question: TQuestion) => void
}

const styles = StyleSheet.create({
    buttonWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        paddingHorizontal: 40,
    },
    divider: {
        marginVertical: 20,
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: RFValue(13),
        fontWeight: 'bold',
    },
})

const Question = ({ onDelete: onDeleteProp, onEdit: onEditProp, question }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const { mutate: translate, data: translation, isPending } = useDeepLTranslationMutation()

    const onDelete = useCallback(() => {
        onDeleteProp(question)
    }, [onDeleteProp, question])

    const onEdit = useCallback(() => {
        onEditProp(question)
    }, [onEditProp, question])

    useEffect(() => {
        if (locale === Locale.DE) return

        if (!question.question || question.question.trim().length === 0) return

        translate({ text: question.question })
    }, [question, translate, locale])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>
                    {isPending ? <LoadingSpinner size={20} /> : (translation ?? question.question)}
                </Text>

                <View style={styles.buttonWrapper}>
                    <IconButton
                        size={20}
                        icon='pencil'
                        mode='contained-tonal'
                        onPress={onEdit}
                    />
                    <IconButton
                        size={20}
                        icon='trash-can'
                        mode='contained-tonal'
                        onPress={onDelete}
                    />
                </View>
            </View>
            {question.typeID === QuestionType.Rating && (
                <StarsInput
                    disabled
                    name={question.id.toString()}
                    rules={{ required: intl.formatMessage(translations.required) }}
                />
            )}
            {question.typeID === QuestionType.Text && (
                <TextInput
                    disabled
                    multiline
                    name={question.id.toString()}
                />
            )}
            <Divider style={styles.divider} />
        </View>
    )
}
export default Question
