import { ScrollView, StyleSheet, View } from 'react-native'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormDialog from '~/views/Management/Forms/components/AddOrEditFormDialog'
import FormItem from '~/views/Management/Forms/components/FormItem'
import { useFormManagementLogic } from '~/views/Management/Forms/hooks/useFormManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        marginBottom: 50,
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

    return (
        <ManagementWrapper
            onFab={onCreate}
            loading={loading}
        >
            <ScrollView>
                <View style={styles.content}>
                    {forms?.map((form) => (
                        <FormItem
                            key={form.id}
                            form={form}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onDesign={onDesign}
                            departments={departments ?? []}
                        />
                    ))}
                </View>
            </ScrollView>
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
