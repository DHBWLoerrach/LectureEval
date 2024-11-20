import { useCallback } from 'react'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Department } from '~/types/Department'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditDepartmentDialog from '~/views/Management/Departments/components/AddOrEditDepartmentDialog'
import DepartmentItem from '~/views/Management/Departments/components/DepartmentItem'
import { useDepartmentManagementLogic } from '~/views/Management/Departments/hooks/useDepartmentManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        paddingBottom: 100,
        padding: 20,
    },
})

const DepartmentsManagement = () => {
    const { editInfo, departments, loading, onEdit, onClose, onSave, onCreate, onDelete } =
        useDepartmentManagementLogic()

    const renderItem = useCallback<ListRenderItem<Department>>(
        ({ item }) => {
            return (
                <DepartmentItem
                    department={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )
        },
        [onDelete, onEdit],
    )

    return (
        <ManagementWrapper
            onFab={onCreate}
            loading={loading}
        >
            <FlatList
                contentContainerStyle={styles.content}
                data={departments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
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
