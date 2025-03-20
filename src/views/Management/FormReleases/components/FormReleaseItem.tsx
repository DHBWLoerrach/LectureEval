import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isEqual } from 'date-fns/isEqual';
import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';
import { startOfDay } from 'date-fns/startOfDay';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { CourseAssignmentWithLecture } from '~/queries/CourseAssignments/useCourseAssignmentsWithLectureQuery';
import { colors } from '~/styles/colors';
import { globalStyles } from '~/styles/globalStyles';
import { CourseAssignment } from '~/types/CourseAssignment';

const styles = StyleSheet.create({
  activeCard: {
    backgroundColor: colors.green,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  buttons: {
    flexDirection: 'row',
  },
  inactiveCard: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  assignment: CourseAssignmentWithLecture;
  onEdit: (assignment: CourseAssignment) => void;
  onDelete: (assignment: CourseAssignmentWithLecture) => void;
};

const FormReleaseItem = ({
  assignment,
  onEdit: onEditProp,
  onDelete: onDeleteProp,
}: Props) => {
  const onEdit = useCallback(() => {
    onEditProp(assignment);
  }, [onEditProp, assignment]);

  const onDelete = useCallback(() => {
    onDeleteProp(assignment);
  }, [onDeleteProp, assignment]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const cardStyle = useMemo(() => {
    let release = parse(assignment.releaseDate, 'dd.MM.yyyy', new Date());
    let recall = parse(assignment.recallDate, 'dd.MM.yyyy', new Date());

    if (!isValid(release) || !isValid(recall)) return styles.inactiveCard;

    release = startOfDay(release);
    recall = startOfDay(recall);

    const active =
      (isEqual(release, today) || isAfter(today, release)) &&
      (isEqual(recall, today) || isBefore(today, recall));

    return active ? styles.activeCard : styles.inactiveCard;
  }, [assignment, today]);

  return (
    <Card style={cardStyle} contentStyle={styles.row} mode="contained">
      <View style={styles.text}>
        <Text style={globalStyles.title} numberOfLines={1}>
          {assignment.lecture.name}
        </Text>
        <Text>
          {assignment.releaseDate} - {assignment.recallDate}
        </Text>
      </View>
      <View style={styles.buttons}>
        <IconButton onPress={onEdit} icon="pencil" size={20} />
        <IconButton onPress={onDelete} icon="trash-can" size={20} />
      </View>
    </Card>
  );
};

export default FormReleaseItem;
