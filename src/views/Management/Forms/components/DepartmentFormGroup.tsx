import { useCallback, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { Icon, Text, TouchableRipple } from 'react-native-paper'
import { Department } from '~/types/Department'
import { Form } from '~/types/Form'
import FormItem from '~/views/Management/Forms/components/FormItem'

type Props = {
    onEdit: (form: Form) => void
    onDelete: (form: Form) => void
    onDesign: (form: Form) => void
    searching: boolean
    department: Department
    forms: Form[]
}

const styles = StyleSheet.create({
    content: {
        gap: 10,
    },
    heading: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
    },
})

const DepartmentFormGroup = ({
    department,
    searching,
    forms,
    onDelete,
    onDesign,
    onEdit,
}: Props) => {
    const [expanded, setExpanded] = useState(true)

    const departmentForms = useMemo(
        () => forms.filter((f) => f.departmentID === department.id),
        [department, forms],
    )

    const renderItem = useCallback<ListRenderItem<Form>>(
        ({ item }) => {
            return (
                <FormItem
                    form={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDesign={onDesign}
                />
            )
        },
        [onDelete, onDesign, onEdit],
    )

    if (departmentForms.length === 0) return null

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
                <FlatList<Form>
                    data={departmentForms}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    )
}

export default DepartmentFormGroup
