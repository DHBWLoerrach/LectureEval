import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery'
import { colors } from '~/styles/colors'
import { globalStyles } from '~/styles/globalStyles'
import { CourseAssignment } from '~/types/CourseAssignment'

const styles = StyleSheet.create({
    activeCard: {
        backgroundColor: colors.green,
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    buttons: {
        flexDirection: 'row',
    },
    inactiveCard: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        maxWidth: '70%',
    },
})

type Props = {
    assignment: CourseAssignmentWithLecture
    onEdit: (assignment: CourseAssignment) => void
    onDelete: (assignment: CourseAssignmentWithLecture) => void
    todaysDate: string
}

const FormReleaseItem = ({
    assignment,
    onEdit: onEditProp,
    onDelete: onDeleteProp,
    todaysDate,
}: Props) => {
    const onEdit = useCallback(() => {
        onEditProp(assignment)
    }, [onEditProp, assignment])

    const onDelete = useCallback(() => {
        onDeleteProp(assignment)
    }, [onDeleteProp, assignment])

    const cardStyle = useMemo(
        () =>
            assignment.releaseDate <= todaysDate && todaysDate <= assignment.recallDate
                ? styles.activeCard
                : styles.inactiveCard,
        [assignment, todaysDate],
    )

    return (
        <Card
            style={cardStyle}
            contentStyle={styles.row}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={globalStyles.title}
                    numberOfLines={1}
                >
                    {assignment.lecture.name}
                </Text>
                <Text>
                    {assignment.releaseDate} - {assignment.recallDate}
                </Text>
            </View>
            <View style={styles.buttons}>
                <IconButton
                    onPress={onEdit}
                    icon='pencil'
                    size={20}
                />
                <IconButton
                    onPress={onDelete}
                    icon='trash-can'
                    size={20}
                />
            </View>
        </Card>
    )
}

export default FormReleaseItem
