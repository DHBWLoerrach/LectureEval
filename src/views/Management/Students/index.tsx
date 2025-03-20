import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useCoursesQuery } from '~/queries/Courses/useCoursesQuery';
import { useStudentsQuery } from '~/queries/Students/useStudentsQuery';
import { globalStyles } from '~/styles/globalStyles';
import { translations } from '~/translations/translations';
import { Course } from '~/types/Course';
import { Student } from '~/types/Student';
import ManagementWrapper from '~/views/Management/components/ManagementWrapper';
import StudentGroup from '~/views/Management/Students/components/StudentGroup';
import { useStudentFilterLogic } from '~/views/Management/Students/hooks/useStudentFilterLogic';

const StudentsManagement = () => {
  const intl = useIntl();

  const { data: students, isLoading: studentsLoading } = useStudentsQuery();
  const { data: courses, isLoading: coursesLoading } = useCoursesQuery();

  const { filteredStudents, search, setSearch } = useStudentFilterLogic({
    students: students ?? [],
  });

  const studentsByCourse = useMemo(() => {
    return filteredStudents.reduce((acc, student) => {
      const courseId = student.courseID;
      if (!acc.has(courseId)) {
        acc.set(courseId, []);
      }
      acc.get(courseId)?.push(student);
      return acc;
    }, new Map<number, Student[]>());
  }, [filteredStudents]);

  const renderGroup = useCallback<ListRenderItem<Course>>(
    ({ item }) => {
      return (
        <StudentGroup
          course={item}
          searching={search.length > 0}
          students={studentsByCourse.get(item.id) ?? []}
        />
      );
    },
    [search.length, studentsByCourse]
  );

  return (
    <ManagementWrapper fab={false} loading={studentsLoading || coursesLoading}>
      <Searchbar
        style={globalStyles.searchbar}
        value={search}
        onChangeText={setSearch}
        placeholder={intl.formatMessage(translations.search)}
      />
      {filteredStudents.length === 0 ? (
        <View style={globalStyles.noDataContainer}>
          <Text style={globalStyles.noDataText}>
            {intl.formatMessage(translations.noData)}
          </Text>
        </View>
      ) : (
        <FlatList<Course>
          data={courses}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={globalStyles.list}
        />
      )}
    </ManagementWrapper>
  );
};

export default StudentsManagement;
