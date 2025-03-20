import { useMemo } from 'react';
import { List, Text } from 'react-native-paper';
import { Question } from '~/types/Question';
import BarChart from '~/views/Detail/components/BarChart';
import styles from '~/views/Detail/styles';

type Props = {
  question: Question;
  questionFormValues: Record<string, string[]>;
};

const DifficultyItem = ({ question, questionFormValues }: Props) => {
  const groups = useMemo(() => {
    const initialGroups = [0, 0, 0];
    questionFormValues[question.id]?.forEach((element) => {
      const intElement = parseInt(element, 10);
      if (intElement >= 1 && intElement <= 3) {
        initialGroups[intElement - 1] += 1;
      }
    });
    return initialGroups;
  }, [questionFormValues, question.id]);

  const labels = useMemo(() => ['1', '2', '3'], []);

  return (
    <List.Item
      title={() => (
        <Text style={styles.multiLineTitle}>{question.question}</Text>
      )}
      description={() => <BarChart values={groups} labels={labels} />}
    />
  );
};

export default DifficultyItem;
