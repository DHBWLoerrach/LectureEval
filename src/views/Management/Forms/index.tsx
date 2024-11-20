import { useCallback } from 'react'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Form } from '~/types/Form'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormDialog from '~/views/Management/Forms/components/AddOrEditFormDialog'
import FormItem from '~/views/Management/Forms/components/FormItem'
import { useFormManagementLogic } from '~/views/Management/Forms/hooks/useFormManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        paddingBottom: 100,
        padding: 20,
    },
})

const FormsManagement = () => {
    const {
        forms,
        loading,
        editInfo,
        departments,
        onCreate,
        onDelete,
        onEdit,
        onSave,
        onClose,
        onDesign,
    } = useFormManagementLogic()

    const renderItem = useCallback<ListRenderItem<Form>>(
        ({ item }) => {
            return (
                <FormItem
                    form={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDesign={onDesign}
                    departments={departments ?? []}
                />
            )
        },
        [departments, onDelete, onDesign, onEdit],
    )

    return (
        <ManagementWrapper
            onFab={onCreate}
            loading={loading}
        >
            <FlatList
                contentContainerStyle={styles.content}
                data={forms}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            {editInfo && (
                <AddOrEditFormDialog
                    forms={forms}
                    onSave={onSave}
                    onClose={onClose}
                    departments={departments ?? []}
                    initialData={editInfo.initialData}
                />
            )}
        </ManagementWrapper>
    )
}

export default FormsManagement
