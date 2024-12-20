import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
// eslint-disable-next-line no-restricted-imports
import { TouchableOpacity, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { Route } from '~/enums/Route'
import { translations } from '~/translations/translations'
import { CourseAssignment } from '~/types/CourseAssignment'
import styles from '~/views/Lecturer/styles'

type Props = {
    courseAssignment: CourseAssignment
    courseMap: Record<string, string>
    ratingAverages: Record<string, string | number>
    difficultyAverages: Record<string, string | number>
}

const CourseItem = ({ courseAssignment, courseMap, ratingAverages, difficultyAverages }: Props) => {
    const intl = useIntl()

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    const navigateTo = useCallback(
        (page: Route, courseAssignmentID: number) => () =>
            navigation.navigate(page, { courseAssignmentID: courseAssignmentID }),
        [navigation],
    )

    return (
        <TouchableOpacity onPress={navigateTo(Route.DetailView, courseAssignment.id)}>
            <Card
                style={styles.card}
                contentStyle={styles.row}
                mode='contained'
            >
                <View style={styles.text}>
                    <Text style={styles.title}>{courseMap[courseAssignment.courseID]}</Text>
                    <Text>
                        {intl.formatMessage(translations.rating)}:{' '}
                        {ratingAverages[courseAssignment.id]}{' '}
                        {intl.formatMessage(translations.stars)}
                    </Text>
                    <Text>
                        {intl.formatMessage(translations.difficulty)}:{' '}
                        {difficultyAverages[courseAssignment.id]}/3
                    </Text>
                </View>
                <View style={styles.button}>
                    <IconButton
                        onPress={navigateTo(Route.DetailView, courseAssignment.id)}
                        icon='arrow-right'
                        size={20}
                    />
                </View>
            </Card>
        </TouchableOpacity>
    )
}

export default CourseItem
