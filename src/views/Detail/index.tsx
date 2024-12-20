import { Route } from '@react-navigation/native'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, View } from 'react-native'
import { List, Searchbar } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { QuestionType } from '~/enums/QuestionType'
import { Route as RouteEnum } from '~/enums/Route'
import { useQueryOnFocus } from '~/hooks/useQueryOnFocus'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Question } from '~/types/Question'
import DifficultyItem from '~/views/Detail/components/DifficultyItem'
import RatingItem from '~/views/Detail/components/RatingItem'
import TextItem from '~/views/Detail/components/TextItem'
import { useDetailsFilterLogic } from '~/views/Detail/hooks/useDetailsFilterLogic'
import { useDetailsLogic } from '~/views/Detail/hooks/useDetailsLogic'
import styles from '~/views/Detail/styles'

export type DetailRouteParams = {
    courseAssignmentID: number
}

type Props = {
    route: Route<RouteEnum.DetailView, DetailRouteParams>
}

/**
 * This component renders a detailed view for course assignments, including a searchable list of questions with ratings, difficulties, and text inputs.
 */
const Detail = ({ route }: Props) => {
    useQueryOnFocus()

    const { courseAssignmentID } = route.params
    const intl = useIntl()

    const { questions, isLoading, getFormattedString, questionFormValues } =
        useDetailsLogic(courseAssignmentID)

    const { searchedDetails, search, setSearch } = useDetailsFilterLogic({
        questions: questions ?? [],
    })

    /**
     * Shows a Question in a different Format depending on QuestionType
     *
     * Rating: Show average rating of question based on 5 stars and  f unfolded a graph with the distribution.
     *
     * Result: Show average overall rating based on 5 stars and if unfolded a graph with the distribution.
     *
     * Text: Don't show anything if not unfolded. When unfolded show a List of all Answers.
     *
     * Difficulty: Show average difficulty rating based on 3 stars and if unfolded a graph with the distribution.
     */
    const renderQuestionItem = useCallback(
        ({ item: question }: { item: Question }) => (
            <View style={globalStyles.listAccordionWrapper}>
                <List.Accordion
                    title={question.question}
                    titleStyle={globalStyles.listAccordionTitle}
                    style={globalStyles.listAccordion}
                    description={getFormattedString(question)}
                >
                    {question.typeID === QuestionType.Rating && (
                        <RatingItem
                            question={question}
                            questionFormValues={questionFormValues}
                        />
                    )}
                    {question.typeID === QuestionType.Result && (
                        <RatingItem
                            question={question}
                            questionFormValues={questionFormValues}
                        />
                    )}
                    {question.typeID === QuestionType.Text && (
                        <TextItem
                            question={question}
                            questionFormValues={questionFormValues}
                        />
                    )}
                    {question.typeID === QuestionType.Difficulty && (
                        <DifficultyItem
                            question={question}
                            questionFormValues={questionFormValues}
                        />
                    )}
                </List.Accordion>
            </View>
        ),
        [questionFormValues, getFormattedString],
    )

    if (isLoading) return <LoadingSpinner />

    return (
        <View>
            <Searchbar
                style={globalStyles.searchbar}
                value={search}
                onChangeText={setSearch}
                placeholder={intl.formatMessage(translations.search)}
            />

            <FlatList<Question>
                data={searchedDetails as Question[]}
                keyExtractor={(question) => question.id.toString()}
                renderItem={renderQuestionItem}
                contentContainerStyle={styles.listSection}
            />
        </View>
    )
}

export default Detail
