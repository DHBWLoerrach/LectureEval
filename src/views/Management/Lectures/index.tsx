import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import AddOrEditLectureDialog from '~/views/Management/Lectures/components/AddOrEditLectureDialog'
import DepartmentLectureGroup from '~/views/Management/Lectures/components/DepartmentLectureGroup'
import { useLectureFilterLogic } from '~/views/Management/Lectures/hooks/useLectureFilterLogic'
import { useLectureManagementLogic } from '~/views/Management/Lectures/hooks/useLectureManagementLogic'
const styles = StyleSheet.create({
    list: {
        paddingBottom: 100,
    },
    search: {
        backgroundColor: colors.tertiary,
        margin: 20,
        marginBottom: 10,
    },
})

const LecturesManagement = () => {
    const intl = useIntl()

    const {
        lectures,
        loading,
        editInfo,
        departments,
        semesters,
        onCreate,
        onDelete,
        onEdit,
        onSave,
        onClose,
    } = useLectureManagementLogic()

    const { filteredLectures, search, setSearch } = useLectureFilterLogic({
        lectures: lectures ?? [],
    })

    const renderItem = useCallback<ListRenderItem<Department>>(
        ({ item }) => {
            return (
                <DepartmentLectureGroup
                    department={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    lectures={filteredLectures}
                    searching={search.length > 0}
                    semesters={semesters ?? []}
                />
            )
        },
        [filteredLectures, onDelete, onEdit, search.length, semesters],
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
            <FlatList<Department>
                data={departments}
                renderItem={renderItem}
                keyExtractor={(dep) => dep.id.toString()}
                contentContainerStyle={styles.list}
            />
            {editInfo && (
                <AddOrEditLectureDialog
                    lectures={lectures}
                    onSave={onSave}
                    onClose={onClose}
                    semesters={semesters ?? []}
                    departments={departments ?? []}
                    initialData={editInfo.initialData}
                />
            )}
        </ManagementWrapper>
    )
}

export default LecturesManagement
