import { useIntl } from 'react-intl'
import { FlatList, View } from 'react-native'
import { List, Text } from 'react-native-paper'
import { translations } from '~/translations/translations'
import { Question } from '~/types/Question'
import styles from '~/views/Detail/styles'

type Props = {
    question: Question
    questionFormValues: Record<string, string[]>
}

const TextItem = ({ question, questionFormValues }: Props) => {
    const intl = useIntl()

    return (
        <List.Item
            title={() => <Text style={styles.multiLineTitle}>{question.question}</Text>}
            description={() => (
                <View>
                    <Text style={styles.answerTitle}>
                        {intl.formatMessage(translations.answers)}:
                    </Text>

                    <FlatList
                        data={questionFormValues[question.id]}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.answerElement}>
                                <Text>{item}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        />
    )
}

export default TextItem
