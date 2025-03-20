import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { Department } from '~/types/Department';
import { Lecture } from '~/types/Lecture';
import { Semester } from '~/types/Semester';
import SemesterLectureGroup from '~/views/Management/Lectures/components/SemesterLectureGroup';

const styles = StyleSheet.create({
  content: {
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  list: {
    gap: 10,
  },
});

type Props = {
  onEdit: (lecture: Lecture) => void;
  onDelete: (lecture: Lecture) => void;
  semesters: Semester[];
  department: Department;
  lectures: Lecture[];
  searching: boolean;
};

const DepartmentLectureGroup = ({
  department,
  lectures,
  onDelete,
  onEdit,
  searching,
  semesters,
}: Props) => {
  const [expanded, setExpanded] = useState(true);

  const departmentLectures = useMemo(
    () => lectures.filter((l) => l.departmentID === department.id),
    [department, lectures]
  );

  const renderItem = useCallback<ListRenderItem<Semester>>(
    ({ item }) => {
      return (
        <SemesterLectureGroup
          semester={item}
          onEdit={onEdit}
          onDelete={onDelete}
          lectures={departmentLectures}
          searching={searching}
        />
      );
    },
    [departmentLectures, onDelete, onEdit, searching]
  );

  // Don't show anything if no lectures are found
  if (departmentLectures.length === 0) return null;

  return (
    <View style={styles.content}>
      <TouchableRipple onPress={() => setExpanded(!expanded)}>
        <View style={styles.heading}>
          <Icon
            source={expanded || searching ? 'chevron-down' : 'chevron-right'}
            size={20}
          />
          <Text variant="headlineSmall">{department.name}</Text>
        </View>
      </TouchableRipple>
      {(expanded || searching) && (
        <FlatList<Semester>
          data={semesters}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default DepartmentLectureGroup;
