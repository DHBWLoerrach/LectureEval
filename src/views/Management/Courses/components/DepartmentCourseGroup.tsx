import { useMemo, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRipple } from 'react-native-paper'
import { Course } from '~/types/Course'
import { Department } from '~/types/Department'
import CourseItem from '~/views/Management/Courses/components/CourseItem'

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
    onEdit: (course: Course) => void
    onDelete: (course: Course) => void
    searching: boolean
    courses: Course[]
    department: Department
}

const DepartmentCourseGroup = ({ courses, department, onDelete, onEdit, searching }: Props) => {
    const [expanded, setExpanded] = useState(false)

    const departmentCourses = useMemo(
        () => courses.filter((l) => l.departmentID === department.id),
        [department, courses],
    )

    if (departmentCourses.length === 0) return null

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
                    data={departmentCourses}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <CourseItem
                            course={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    )
}

export default DepartmentCourseGroup
