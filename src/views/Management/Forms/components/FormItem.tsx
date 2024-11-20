import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Department } from '~/types/Department'
import { Form } from '~/types/Form'

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
    },
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
    text: {
        maxWidth: '50%',
    },
    title: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
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
            <View style={styles.text}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >
                    {form.name}
                </Text>
                <Text
                    style={styles.subtitle}
                    numberOfLines={1}
                >
                    {department?.name}
                </Text>
            </View>
            <View style={styles.buttons}>
                <IconButton
                    onPress={onEdit}
                    icon='pencil'
                    size={20}
                    mode='contained-tonal'
                />
                <IconButton
                    onPress={onDesign}
                    icon='magic-staff'
                    size={20}
                    mode='contained-tonal'
                />
                <IconButton
                    onPress={onDelete}
                    icon='trash-can'
                    size={20}
                    mode='contained-tonal'
                />
            </View>
        </Card>
    )
}

export default FormItem
