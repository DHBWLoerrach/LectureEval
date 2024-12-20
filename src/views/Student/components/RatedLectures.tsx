import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
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
        flex: 1,
        justifyContent: 'center',
    },
    placeholderText: {
        color: colors.secondary,
        textAlign: 'center',
    },
})

const RatedLectures = ({ semesters, lectures }: Props) => {
    useQueryOnFocus()

    const intl = useIntl()

    const renderItem = useCallback<ListRenderItem<LectureAssignment>>(
        ({ item }) => (
            <Card
                style={globalStyles.card}
                mode='contained'
            >
                <View>
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
            </Card>
        ),
        [semesters],
    )

    if (lectures.length === 0)
        return (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                    {intl.formatMessage(translations.noRatedLectures)}
                </Text>
            </View>
        )

    return (
        <FlatList
            data={lectures}
            renderItem={renderItem}
            contentContainerStyle={[globalStyles.list, styles.list]}
            keyExtractor={(item) => item.id.toString()}
        />
    )
}

export default RatedLectures
