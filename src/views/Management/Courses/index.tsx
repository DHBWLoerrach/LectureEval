import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { globalStyles } from '~/styles/globalStyles';
import { translations } from '~/translations/translations';
import { Department } from '~/types/Department';
import ManagementWrapper from '~/views/Management/components/ManagementWrapper';
import AddOrEditCourseDialog from '~/views/Management/Courses/components/AddOrEditCourseDialog';
import DepartmentCourseGroup from '~/views/Management/Courses/components/DepartmentCourseGroup';
import { useCourseFilterLogic } from '~/views/Management/Courses/hooks/useCourseFilterLogic';
import { useCourseManagementLogic } from '~/views/Management/Courses/hooks/useCourseManagementLogic';

const CoursesManagement = () => {
  const intl = useIntl();

  const {
    courses,
    loading,
    editInfo,
    departments,
    onCreate,
    onDelete,
    onEdit,
    onSave,
    onClose,
  } = useCourseManagementLogic();

  const { filteredCourses, search, setSearch } = useCourseFilterLogic({
    courses: courses ?? [],
  });

  const renderItem = useCallback<ListRenderItem<Department>>(
    ({ item }) => {
      return (
        <DepartmentCourseGroup
          department={item}
          courses={filteredCourses}
          onEdit={onEdit}
          onDelete={onDelete}
          searching={search.length > 0}
        />
      );
    },
    [filteredCourses, onDelete, onEdit, search.length]
  );
  return (
    <ManagementWrapper onFab={onCreate} loading={loading}>
      <Searchbar
        style={globalStyles.searchbar}
        value={search}
        onChangeText={setSearch}
        placeholder={intl.formatMessage(translations.search)}
      />
      {filteredCourses.length === 0 ? (
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
        <AddOrEditCourseDialog
          courses={courses}
          onSave={onSave}
          onClose={onClose}
          departments={departments ?? []}
          initialData={editInfo.initialData}
        />
      )}
    </ManagementWrapper>
  );
};

export default CoursesManagement;
