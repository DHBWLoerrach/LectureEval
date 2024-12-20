import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, View } from 'react-native'
import { Searchbar, Text } from 'react-native-paper'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditDepartmentDialog from '~/views/Management/Departments/components/AddOrEditDepartmentDialog'
import DepartmentItem from '~/views/Management/Departments/components/DepartmentItem'
import { useDepartmentFilterLogic } from '~/views/Management/Departments/hooks/useDepartmentFilterLogic'
import { useDepartmentManagementLogic } from '~/views/Management/Departments/hooks/useDepartmentManagementLogic'

const DepartmentsManagement = () => {
    const intl = useIntl()

    const {
        editInfo,
        departments,
        loading,
        userLocation,
        onEdit,
        onClose,
        onSave,
        onCreate,
        onDelete,
    } = useDepartmentManagementLogic()

    const { search, filteredDepartments, setSearch } = useDepartmentFilterLogic({
        departments: departments ?? [],
    })

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
            <Searchbar
                style={globalStyles.searchbar}
                value={search}
                onChangeText={setSearch}
                placeholder={intl.formatMessage(translations.search)}
            />
            {filteredDepartments.length === 0 ? (
                <View style={globalStyles.noDataContainer}>
                    <Text style={globalStyles.noDataText}>
                        {intl.formatMessage(translations.noData)}
                    </Text>
                </View>
            ) : (
                <FlatList<Department>
                    contentContainerStyle={globalStyles.flatListContent}
                    data={filteredDepartments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
            {editInfo && !!userLocation && (
                <AddOrEditDepartmentDialog
                    onSave={onSave}
                    onClose={onClose}
                    location={userLocation}
                    departments={departments ?? []}
                    initialData={editInfo.initialData}
                />
            )}
        </ManagementWrapper>
    )
}

export default DepartmentsManagement
