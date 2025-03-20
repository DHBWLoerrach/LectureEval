import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { Lecture } from '~/types/Lecture';
import { Semester } from '~/types/Semester';
import LectureItem from '~/views/Management/Lectures/components/LectureItem';

const styles = StyleSheet.create({
  content: {
    gap: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

type Props = {
  onEdit: (lecture: Lecture) => void;
  onDelete: (lecture: Lecture) => void;
  semester: Semester;
  lectures: Lecture[];
  searching: boolean;
};

const SemesterLectureGroup = ({
  onDelete,
  onEdit,
  semester,
  lectures,
  searching,
}: Props) => {
  const [expanded, setExpanded] = useState(false);

  const semesterLectures = useMemo(
    () => lectures.filter((l) => l.semesterID === semester.id),
    [lectures, semester]
  );

  const renderItem = useCallback<ListRenderItem<Lecture>>(
    ({ item }) => {
      return <LectureItem lecture={item} onEdit={onEdit} onDelete={onDelete} />;
    },
    [onDelete, onEdit]
  );

  // Don't show anything if no lectures are found
  if (semesterLectures.length === 0) return null;

  return (
    <View style={styles.content}>
      <TouchableRipple onPress={() => setExpanded(!expanded)}>
        <View style={styles.heading}>
          <Icon
            source={expanded || searching ? 'chevron-down' : 'chevron-right'}
            size={20}
          />
          <Text variant="titleLarge">{semester.name}</Text>
        </View>
      </TouchableRipple>
      {(expanded || searching) && (
        <FlatList<Lecture>
          data={semesterLectures}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default SemesterLectureGroup;
