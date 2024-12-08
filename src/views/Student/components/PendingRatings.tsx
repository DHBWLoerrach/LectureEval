import { useCallback } from 'react'
import { useIntl } from 'react-intl'
// eslint-disable-next-line no-restricted-imports
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
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
        maxWidth: '89%',
    },
})

const PendingRatings = ({ semesters, lectures }: Props) => {
    const intl = useIntl()

    const onPress = useCallback(() => {
        // TODO Open form
    }, [])

    const renderItem = useCallback<ListRenderItem<LectureAssignment>>(
        ({ item }) => (
            <Card
                style={globalStyles.card}
                mode='contained'
            >
                <TouchableOpacity onPress={onPress}>
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
                            onPress={onPress}
                        />
                    </View>
                </TouchableOpacity>
            </Card>
        ),
        [onPress, semesters],
    )

    if (lectures.length === 0)
        return (
            <Text style={styles.placeholder}>
                {intl.formatMessage(translations.noPendingRatings)}
            </Text>
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

export default PendingRatings
