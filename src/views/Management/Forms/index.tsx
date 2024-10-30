import { StyleSheet, View } from 'react-native'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormDialog from '~/views/Management/Forms/components/AddOrEditFormDialog'
import FormItem from '~/views/Management/Forms/components/FormItem'
import { useFormManagementLogic } from '~/views/Management/Forms/hooks/useFormManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        padding: 20,
    },
})

const FormsManagement = () => {
    const { forms, loading, editInfo, departments, onCreate, onDelete, onEdit, onSave, onClose } =
        useFormManagementLogic()

    return (
        <ManagementWrapper
            onFab={onCreate}
            loading={loading}
        >
            <View style={styles.content}>
                {forms?.map((form) => (
                    <FormItem
                        key={form.id}
                        form={form}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        departments={departments ?? []}
                    />
                ))}
            </View>
            {editInfo && (
                <AddOrEditFormDialog
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
