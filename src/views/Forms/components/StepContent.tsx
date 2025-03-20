import { ScrollView } from 'react-native';
import LoadingSpinner from '~/components/LoadingSpinner';
import { useQuestionsForStepQuery } from '~/queries/Questions/useQuestionsForStepQuery';
import { Step } from '~/types/Step';
import Question from '~/views/Forms/components/Question';

type Props = {
  step: Step | undefined;
};

const StepContent = ({ step }: Props) => {
  const { data: questions, isLoading } = useQuestionsForStepQuery({
    stepId: step?.id,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView>
      {questions?.map((question) => (
        <Question key={question.id} question={question} />
      ))}
    </ScrollView>
  );
};

export default StepContent;
