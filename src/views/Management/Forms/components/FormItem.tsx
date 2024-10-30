import { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Card, IconButton } from 'react-native-paper'
import { Department } from '~/views/Management/Forms/types/Department'
import { Form } from '~/views/Management/Forms/types/Form'

const styles = StyleSheet.create({
    card: {
        padding: 20,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subtitle: {
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
})

type Props = {
    form: Form
    onEdit: (form: Form) => void
    onDelete: (form: Form) => void
    departments: Department[]
}

const FormItem = ({ form, onEdit: onEditProp, onDelete: onDeleteProp, departments }: Props) => {
    const onEdit = useCallback(() => {
        onEditProp(form)
    }, [onEditProp, form])

    const onDelete = useCallback(() => {
        onDeleteProp(form)
    }, [onDeleteProp, form])

    const department = useMemo(
        () => departments.find((dep) => dep.id === form.departmentID),
        [departments, form.departmentID],
    )

    return (
        <Card
            style={styles.card}
            contentStyle={styles.row}
        >
            <View>
                <Text style={styles.title}>{form.name}</Text>
                <Text style={styles.subtitle}>{department?.name}</Text>
            </View>
            <View style={styles.row}>
                <IconButton
                    onPress={onEdit}
                    icon='pencil'
                />
                <IconButton
                    onPress={onDelete}
                    icon='trash-can'
                />
            </View>
        </Card>
    )
}

export default FormItem
