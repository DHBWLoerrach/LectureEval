import { Route } from '@react-navigation/native'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, View } from 'react-native'
import { List, Searchbar } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { QuestionType } from '~/enums/QuestionType'
import { Route as RouteEnum } from '~/enums/Route'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Question } from '~/types/Question'
import DifficultyItem from '~/views/Detail/components/DifficultyItem'
import RatingItem from '~/views/Detail/components/RatingItem'
import TextItem from '~/views/Detail/components/TextItem'
import { useDetailsLogic } from '~/views/Detail/hooks/useDetailsLogic'
import styles from '~/views/Detail/styles'

export type DetailRouteParams = {
    courseAssignmentID: number
}

type Props = {
    route: Route<RouteEnum.DetailView, DetailRouteParams>
}

const Detail = ({ route }: Props) => {
    const { courseAssignmentID } = route.params
    const intl = useIntl()

    const {
        isLoading,
        searchedDetails,
        search,
        setSearch,
        ratingAverages,
        difficultyAverages,
        questionFormValues,
    } = useDetailsLogic(courseAssignmentID)

    const renderQuestionItem = useCallback(
        ({ item: question }: { item: Question }) => {
            const formattedString = () => {
                if (
                    question.typeID === QuestionType.Rating ||
                    question.typeID === QuestionType.Result
                ) {
                    return `${intl.formatMessage(translations.rating)}: ${
                        ratingAverages[question.id] !== null &&
                        typeof ratingAverages[question.id] === 'number'
                            ? `${ratingAverages[question.id]} ${intl.formatMessage(translations.stars)}`
                            : intl.formatMessage(translations.notSet)
                    }`
                } else if (question.typeID === QuestionType.Difficulty) {
                    return `${intl.formatMessage(translations.difficulty)}: ${
                        difficultyAverages[question.id] !== null &&
                        typeof difficultyAverages[question.id] === 'number'
                            ? `${difficultyAverages[question.id]}/3`
                            : intl.formatMessage(translations.notSet)
                    }`
                }
                return undefined
            }

            return (
                <View style={globalStyles.listAccordionWrapper}>
                    <List.Accordion
                        title={question.question}
                        titleStyle={globalStyles.listAccordionTitle}
                        style={globalStyles.listAccordion}
                        description={formattedString()}
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
            )
        },
        [questionFormValues, ratingAverages, difficultyAverages, intl],
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
