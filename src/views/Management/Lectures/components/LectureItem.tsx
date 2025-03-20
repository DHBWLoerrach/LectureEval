import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { globalStyles } from '~/styles/globalStyles';
import { Lecture } from '~/types/Lecture';

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    maxWidth: '70%',
  },
});

type Props = {
  lecture: Lecture;
  onEdit: (lecture: Lecture) => void;
  onDelete: (lecture: Lecture) => void;
};

const LectureItem = ({
  lecture,
  onEdit: onEditProp,
  onDelete: onDeleteProp,
}: Props) => {
  const onEdit = useCallback(() => {
    onEditProp(lecture);
  }, [onEditProp, lecture]);

  const onDelete = useCallback(() => {
    onDeleteProp(lecture);
  }, [onDeleteProp, lecture]);

  return (
    <Card style={globalStyles.card} contentStyle={styles.row} mode="contained">
      <View style={styles.text}>
        <Text style={globalStyles.title} numberOfLines={1}>
          {lecture.name}
        </Text>
      </View>
      <View style={styles.buttons}>
        <IconButton onPress={onEdit} icon="pencil" size={20} />
        <IconButton onPress={onDelete} icon="trash-can" size={20} />
      </View>
    </Card>
  );
};

export default LectureItem;
