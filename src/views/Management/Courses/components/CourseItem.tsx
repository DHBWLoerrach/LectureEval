import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { globalStyles } from '~/styles/globalStyles'
import { Course } from '~/types/Course'

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
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
    course: Course
    onEdit: (course: Course) => void
    onDelete: (course: Course) => void
}

const CourseItem = ({ course, onEdit: onEditProp, onDelete: onDeleteProp }: Props) => {
    const onEdit = useCallback(() => {
        onEditProp(course)
    }, [onEditProp, course])

    const onDelete = useCallback(() => {
        onDeleteProp(course)
    }, [onDeleteProp, course])

    return (
        <Card
            style={globalStyles.card}
            contentStyle={styles.row}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={globalStyles.title}
                    numberOfLines={1}
                >
                    {course.name}
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

export default CourseItem
