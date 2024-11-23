import { useCallback, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRipple } from 'react-native-paper'
import { Course } from '~/types/Course'
import { Student } from '~/types/Student'
import StudentItem from '~/views/Management/Students/components/StudentItem'

type Props = {
    searching: boolean
    course: Course
    students: Student[]
}

const styles = StyleSheet.create({
    content: {
        gap: 10,
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

const StudentGroup = ({ searching, course, students }: Props) => {
    const [expanded, setExpanded] = useState(false)

    const renderItem = useCallback<ListRenderItem<Student>>(({ item }) => {
        return <StudentItem student={item} />
    }, [])

    return (
        <View style={styles.content}>
            <TouchableRipple onPress={() => setExpanded(!expanded)}>
                <View style={styles.heading}>
                    <Icon
                        source={expanded || searching ? 'chevron-down' : 'chevron-right'}
                        size={20}
                    />
                    <Text variant='headlineSmall'>{course.name}</Text>
                </View>
            </TouchableRipple>
            {(expanded || searching) && (
                <FlatList
                    data={students}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    )
}
export default StudentGroup
