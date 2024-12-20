import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRipple } from 'react-native-paper'
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery'
import { Course } from '~/types/Course'
import { CourseAssignment } from '~/types/CourseAssignment'
import FormItem from '~/views/Management/FormReleases/components/FormReleaseItem'

const styles = StyleSheet.create({
    content: {
        gap: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    heading: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})

type Props = {
    onEdit: (assignment: CourseAssignment) => void
    onDelete: (assignment: CourseAssignmentWithLecture) => void
    course: Course
    assignments: CourseAssignmentWithLecture[]
    searching: boolean
}

const CourseFormReleaseGroup = ({ onDelete, onEdit, course, assignments, searching }: Props) => {
    const [expanded, setExpanded] = useState(false)

    const courseAssignemnts = useMemo(
        () => assignments.filter((f) => f.courseID === course.id),
        [assignments, course],
    )

    const todaysDate = useMemo(() => new Date().toLocaleDateString('de-DE'), [])

    const renderItem = useCallback<ListRenderItem<CourseAssignmentWithLecture>>(
        ({ item }) => {
            return (
                <FormItem
                    assignment={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    todaysDate={todaysDate}
                />
            )
        },
        [onDelete, onEdit, todaysDate],
    )

    // Don't show anything if no course assignments are found
    if (courseAssignemnts.length === 0) return null

    return (
        <View style={styles.content}>
            <TouchableRipple onPress={() => setExpanded(!expanded)}>
                <View style={styles.heading}>
                    <Icon
                        source={expanded || searching ? 'chevron-down' : 'chevron-right'}
                        size={20}
                    />
                    <Text variant='titleLarge'>{course.name}</Text>
                </View>
            </TouchableRipple>
            {(expanded || searching) && (
                <FlatList<CourseAssignmentWithLecture>
                    data={courseAssignemnts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    )
}

export default CourseFormReleaseGroup
