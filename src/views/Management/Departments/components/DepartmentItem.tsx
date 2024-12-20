import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Department } from '~/types/Department'

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
    },
    card: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        width: '65%',
    },
    title: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
        overflow: 'hidden',
    },
})

type Props = {
    department: Department
    onEdit: (department: Department) => void
    onDelete: (department: Department) => void
}

const DepartmentItem = ({ department, onDelete: onDeleteProp, onEdit: onEditProp }: Props) => {
    const onEdit = useCallback(() => {
        onEditProp(department)
    }, [onEditProp, department])

    const onDelete = useCallback(() => {
        onDeleteProp(department)
    }, [onDeleteProp, department])

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
                    {department.name}
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

export default DepartmentItem
