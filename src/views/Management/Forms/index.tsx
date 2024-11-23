import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'
import { Form } from '~/types/Form'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditFormDialog from '~/views/Management/Forms/components/AddOrEditFormDialog'
import FormItem from '~/views/Management/Forms/components/FormItem'
import { useFormFilterLogic } from '~/views/Management/Forms/hooks/useFormFilterLogic'
import { useFormManagementLogic } from '~/views/Management/Forms/hooks/useFormManagementLogic'

const styles = StyleSheet.create({
    content: {
        gap: 20,
        paddingBottom: 100,
        padding: 20,
        paddingTop: 0,
    },
    search: {
        backgroundColor: colors.tertiary,
        margin: 20,
        marginBottom: 10,
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
            <Searchbar
                style={styles.search}
                value={search}
                onChangeText={setSearch}
                placeholder={intl.formatMessage(translations.search)}
            />
            <FlatList
                contentContainerStyle={styles.content}
                data={filteredForms}
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
