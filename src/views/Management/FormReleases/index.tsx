import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, View } from 'react-native'
import { Searchbar, Text } from 'react-native-paper'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormReleaseDialog from '~/views/Management/FormReleases/components/AddOrEditFormReleaseDialog'
import DepartmentFormGroup from '~/views/Management/FormReleases/components/DepartmentFormReleaseGroup'
import { useFormReleaseFilterLogic } from '~/views/Management/FormReleases/hooks/useFormReleaseFilterLogic'
import { useFormReleaseManagementLogic } from '~/views/Management/FormReleases/hooks/useFormReleaseManagementLogic'

const FormReleasesManagement = () => {
    const intl = useIntl()

    const {
        assignments,
        loading,
        editInfo,
        forms,
        departments,
        courses,
        onCreate,
        onDelete,
        onEdit,
        onSave,
        onClose,
    } = useFormReleaseManagementLogic()

    const { filteredAssignments, search, setSearch } = useFormReleaseFilterLogic({
        assignments: assignments ?? [],
    })

    const renderItem = useCallback<ListRenderItem<Department>>(
        ({ item }) => {
            return (
                <DepartmentFormGroup
                    department={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    assignments={filteredAssignments}
                    searching={search.length > 0}
                    courses={courses ?? []}
                />
            )
        },
        [filteredAssignments, onDelete, onEdit, search.length, courses],
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
            {filteredAssignments.length === 0 ? (
                <View style={globalStyles.noDataContainer}>
                    <Text style={globalStyles.noDataText}>
                        {intl.formatMessage(translations.noData)}
                    </Text>
                </View>
            ) : (
                <FlatList<Department>
                    data={departments}
                    renderItem={renderItem}
                    keyExtractor={(dep) => dep.id.toString()}
                    contentContainerStyle={globalStyles.list}
                />
            )}
            {editInfo && (
                <AddOrEditFormReleaseDialog
                    assignments={assignments}
                    onSave={onSave}
                    onClose={onClose}
                    forms={forms ?? []}
                    courses={courses ?? []}
                    initialData={editInfo.initialData}
                />
            )}
        </ManagementWrapper>
    )
}

export default FormReleasesManagement
