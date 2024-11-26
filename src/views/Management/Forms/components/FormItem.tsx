import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, IconButton, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Form } from '~/types/Form'

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
    onDesign: (form: Form) => void
}

const FormItem = ({
    form,
    onEdit: onEditProp,
    onDelete: onDeleteProp,
    onDesign: onDesignProp,
}: Props) => {
    const onEdit = useCallback(() => {
        onEditProp(form)
    }, [onEditProp, form])

    const onDelete = useCallback(() => {
        onDeleteProp(form)
    }, [onDeleteProp, form])

    const onDesign = useCallback(() => {
        onDesignProp(form)
    }, [onDesignProp, form])

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
                    {form.name}
                </Text>
            </View>
            <View style={styles.buttons}>
                <IconButton
                    onPress={onEdit}
                    icon='pencil'
                    size={20}
                />
                <IconButton
                    onPress={onDesign}
                    icon='magic-staff'
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

export default FormItem
