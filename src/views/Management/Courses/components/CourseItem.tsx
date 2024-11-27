import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Course } from '~/types/Course'

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
    },
    card: {
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
    title: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
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
            style={styles.card}
            contentStyle={styles.row}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={styles.title}
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
