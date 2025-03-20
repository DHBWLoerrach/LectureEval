import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { globalStyles } from '~/styles/globalStyles';
import { Lecturer } from '~/types/Lecturer';

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    width: '100%',
  },
});

type Props = {
  lecturer: Lecturer;
};

const LecturerItem = ({ lecturer }: Props) => {
  return (
    <Card style={globalStyles.card} contentStyle={styles.row} mode="contained">
      <View style={styles.text}>
        <Text style={globalStyles.title} numberOfLines={1}>
          {lecturer.firstName} {lecturer.lastName}
        </Text>
      </View>
    </Card>
  );
};
export default LecturerItem;
