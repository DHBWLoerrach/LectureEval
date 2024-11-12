import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Department } from '~/types/Department'
import { Form } from '~/types/Form'

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
        fontSize: RFValue(13),
        maxWidth: 170,
        overflow: 'hidden',
    },
    title: {
        fontSize: RFValue(19),
        fontWeight: 'bold',
        maxWidth: 170,
        overflow: 'hidden',
    },
})

type Props = {
    form: Form
    onEdit: (form: Form) => void
    onDelete: (form: Form) => void
    onDesign: (formId: number, departmentId: number) => void
    departments: Department[]
}

const FormItem = ({
    form,
    onEdit: onEditProp,
    onDelete: onDeleteProp,
    onDesign: onDesignProp,
    departments,
}: Props) => {
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

    const onDesign = useCallback(() => {
        if (!department) return

        onDesignProp(form.id, department.id)
    }, [onDesignProp, form.id, department])

    return (
        <Card
            style={styles.card}
            contentStyle={styles.row}
        >
            <View>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >
                    {form.name}
                </Text>
                <Text style={styles.subtitle}>{department?.name}</Text>
            </View>
            <View style={styles.row}>
                <IconButton
                    onPress={onEdit}
                    icon='pencil'
                />
                <IconButton
                    onPress={onDesign}
                    icon='magic-staff'
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
