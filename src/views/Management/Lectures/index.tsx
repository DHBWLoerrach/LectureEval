import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { globalStyles } from '~/styles/globalStyles';
import { translations } from '~/translations/translations';
import { Department } from '~/types/Department';
import ManagementWrapper from '~/views/Management/components/ManagementWrapper';
import AddOrEditLectureDialog from '~/views/Management/Lectures/components/AddOrEditLectureDialog';
import DepartmentLectureGroup from '~/views/Management/Lectures/components/DepartmentLectureGroup';
import { useLectureFilterLogic } from '~/views/Management/Lectures/hooks/useLectureFilterLogic';
import { useLectureManagementLogic } from '~/views/Management/Lectures/hooks/useLectureManagementLogic';

const LecturesManagement = () => {
  const intl = useIntl();

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
  } = useLectureManagementLogic();

  const { filteredLectures, search, setSearch } = useLectureFilterLogic({
    lectures: lectures ?? [],
  });

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
      );
    },
    [filteredLectures, onDelete, onEdit, search.length, semesters]
  );
  return (
    <ManagementWrapper onFab={onCreate} loading={loading}>
      <Searchbar
        style={globalStyles.searchbar}
        value={search}
        onChangeText={setSearch}
        placeholder={intl.formatMessage(translations.search)}
      />
      {filteredLectures.length === 0 ? (
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
  );
};

export default LecturesManagement;
