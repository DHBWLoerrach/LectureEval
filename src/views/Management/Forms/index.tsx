import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormDialog from '~/views/Management/Forms/components/AddOrEditFormDialog'
import DepartmentFormGroup from '~/views/Management/Forms/components/DepartmentFormGroup'
import { useFormFilterLogic } from '~/views/Management/Forms/hooks/useFormFilterLogic'
import { useFormManagementLogic } from '~/views/Management/Forms/hooks/useFormManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        paddingBottom: 100,
        padding: 20,
        paddingTop: 0,
    },
})

const FormsManagement = () => {
    const intl = useIntl()

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

    const { filteredForms, search, setSearch } = useFormFilterLogic({ forms: forms ?? [] })

    const renderItem = useCallback<ListRenderItem<Department>>(
        ({ item }) => {
            return (
                <DepartmentFormGroup
                    department={item}
                    forms={filteredForms}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDesign={onDesign}
                    searching={search.length > 0}
                />
            )
        },
        [filteredForms, onDelete, onDesign, onEdit, search.length],
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
            <FlatList<Department>
                contentContainerStyle={styles.content}
                data={departments}
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
