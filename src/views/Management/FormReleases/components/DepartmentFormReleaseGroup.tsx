import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRipple } from 'react-native-paper'
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery'
import { Course } from '~/types/Course'
import { CourseAssignment } from '~/types/CourseAssignment'
import { Department } from '~/types/Department'
import CourseFormGroup from '~/views/Management/FormReleases/components/CourseFormReleaseGroup'

const styles = StyleSheet.create({
    content: {
        gap: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    heading: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
    },
    list: {
        gap: 10,
    },
})

type Props = {
    onEdit: (assignment: CourseAssignment) => void
    onDelete: (assignment: CourseAssignmentWithLecture) => void
    courses: Course[]
    department: Department
    assignments: CourseAssignmentWithLecture[]
    searching: boolean
}

const DepartmentFormReleaseGroup = ({
    department,
    assignments,
    onDelete,
    onEdit,
    searching,
    courses,
}: Props) => {
    const [expanded, setExpanded] = useState(true)

    const departmentAssignments = useMemo(
        () => assignments.filter((l) => l.lecture.departmentID === department.id),
        [department, assignments],
    )

    const renderItem = useCallback<ListRenderItem<Course>>(
        ({ item }) => {
            return (
                <CourseFormGroup
                    course={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    assignments={departmentAssignments}
                    searching={searching}
                />
            )
        },
        [departmentAssignments, onDelete, onEdit, searching],
    )

    // Don't show anything if no course assignments are found
    if (departmentAssignments.length === 0) return null

    return (
        <View style={styles.content}>
            <TouchableRipple onPress={() => setExpanded(!expanded)}>
                <View style={styles.heading}>
                    <Icon
                        source={expanded || searching ? 'chevron-down' : 'chevron-right'}
                        size={20}
                    />
                    <Text variant='headlineSmall'>{department.name}</Text>
                </View>
            </TouchableRipple>
            {(expanded || searching) && (
                <FlatList<Course>
                    data={courses}
                    contentContainerStyle={styles.list}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    )
}

export default DepartmentFormReleaseGroup
