import { StyleSheet, View } from 'react-native'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditDepartmentDialog from '~/views/Management/Departments/components/AddOrEditDepartmentDialog'
import DepartmentItem from '~/views/Management/Departments/components/DepartmentItem'
import { useDepartmentManagementLogic } from '~/views/Management/Departments/hooks/useDepartmentManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        padding: 20,
    },
})

const DepartmentsManagement = () => {
    const { editInfo, departments, loading, onEdit, onClose, onSave, onCreate, onDelete } =
        useDepartmentManagementLogic()

    return (
        <ManagementWrapper
            onFab={onCreate}
            loading={loading}
        >
            <View style={styles.content}>
                {departments?.map((department) => (
                    <DepartmentItem
                        key={department.id}
                        department={department}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </View>
            {editInfo && (
                <AddOrEditDepartmentDialog
                    onSave={onSave}
                    onClose={onClose}
                    departments={departments ?? []}
                    initialData={editInfo.initialData}
                />
            )}
        </ManagementWrapper>
    )
}

export default DepartmentsManagement
