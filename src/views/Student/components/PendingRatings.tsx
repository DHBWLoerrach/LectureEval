import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { isAfter } from 'date-fns/isAfter'
import { isBefore } from 'date-fns/isBefore'
import { isEqual } from 'date-fns/isEqual'
import { isValid } from 'date-fns/isValid'
import { parse } from 'date-fns/parse'
import { startOfDay } from 'date-fns/startOfDay'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
// eslint-disable-next-line no-restricted-imports
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { Route } from '~/enums/Route'
import { useQueryOnFocus } from '~/hooks/useQueryOnFocus'
import { LectureAssignment } from '~/queries/CourseAssignments/useAssignedLecturesForCourseQuery'
import { colors } from '~/styles/colors'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Semester } from '~/types/Semester'

type Props = {
    semesters: Semester[]
    lectures: LectureAssignment[]
}

const styles = StyleSheet.create({
    list: {
        gap: 5,
        padding: 20,
    },
    placeholder: {
        color: colors.secondary,
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        width: '89%',
    },
})

const PendingRatings = ({ semesters, lectures }: Props) => {
    useQueryOnFocus()

    const intl = useIntl()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    const today = useMemo(() => startOfDay(new Date()), [])

    const activeLectures = useMemo(
        () =>
            lectures.filter((l) => {
                let release = parse(l.releaseDate, 'dd.MM.yyyy', new Date())
                let recall = parse(l.recallDate, 'dd.MM.yyyy', new Date())

                if (!isValid(release) || !isValid(recall)) return false

                release = startOfDay(release)
                recall = startOfDay(recall)

                const active =
                    (isEqual(release, today) || isAfter(today, release)) &&
                    (isEqual(recall, today) || isBefore(today, recall))

                return active
            }),
        [lectures, today],
    )

    const onPress = useCallback(
        (assignment: LectureAssignment) => {
            if (!assignment) return

            navigation.navigate(Route.FormsView, {
                assignment,
            })
        },
        [navigation],
    )

    const renderItem = useCallback<ListRenderItem<LectureAssignment>>(
        ({ item }) => (
            <Card
                style={globalStyles.card}
                mode='contained'
            >
                <TouchableOpacity onPress={() => onPress(item)}>
                    <View style={styles.row}>
                        <View style={styles.text}>
                            <Text
                                style={globalStyles.title}
                                numberOfLines={1}
                            >
                                {item.lecture.name} ({item.lecturer.lastName})
                            </Text>
                            <Text style={globalStyles.subtitle}>
                                {semesters.find((sem) => sem.id === item.lecture.semesterID)?.name}
                            </Text>
                        </View>
                        <IconButton
                            icon='chevron-right'
                            onPress={() => onPress(item)}
                        />
                    </View>
                </TouchableOpacity>
            </Card>
        ),
        [onPress, semesters],
    )

    if (activeLectures.length === 0)
        return (
            <Text style={styles.placeholder}>
                {intl.formatMessage(translations.noPendingRatings)}
            </Text>
        )

    return (
        <FlatList
            data={activeLectures}
            renderItem={renderItem}
            contentContainerStyle={[globalStyles.list, styles.list]}
            keyExtractor={(item) => item.id.toString()}
        />
    )
}

export default PendingRatings
