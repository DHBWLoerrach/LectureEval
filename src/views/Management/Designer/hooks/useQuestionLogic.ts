import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useDialog } from '~/context/DialogContext';
import { useSnackbar } from '~/context/SnackbarContext';
import { useDeleteQuestionMutation } from '~/queries/Questions/useDeleteQuestionMutation';
import { useQuestionsForStepQuery } from '~/queries/Questions/useQuestionsForStepQuery';
import { useUpsertQuestionMutation } from '~/queries/Questions/useUpsertQuestionMutation';
import { translations } from '~/translations/translations';
import { Question } from '~/types/Question';
import { Step } from '~/types/Step';
import { QuestionEditInfo } from '~/views/Management/Designer/components/AddOrEditQuestionDialog';
import { QuestionFormData } from '~/views/Management/Designer/types/QuestionFormData';

type Props = {
  step: Step | undefined;
};

export const useQuestionLogic = ({ step }: Props) => {
  const intl = useIntl();

  const showDialog = useDialog();
  const showSnackbar = useSnackbar();

  const [editInfo, setEditInfo] = useState<QuestionEditInfo>();

  const { mutate: saveQuestion } = useUpsertQuestionMutation();
  const { mutate: deleteQuestion } = useDeleteQuestionMutation();

  const {
    data: questions,
    isLoading,
    refetch: refetchQuestions,
  } = useQuestionsForStepQuery({ stepId: step?.id });

  const maxSerial = useMemo(
    () =>
      questions?.reduce((acc, q) => {
        if (q.serial > acc) return q.serial;

        return acc;
      }, 0) ?? 0,
    [questions]
  );

  const onAdd = useCallback(() => {
    if (!step) return;

    setEditInfo({ stepId: step.id, serial: maxSerial + 1 });
  }, [maxSerial, step]);

  const onEdit = useCallback(
    (question: Question) => {
      if (!step) return;

      setEditInfo({ question, stepId: step.id, serial: question.serial });
    },
    [step]
  );
  const onDelete = useCallback(
    (question: Question) => {
      showDialog({
        title: intl.formatMessage(translations.deleteEntityHeader, {
          entity: intl.formatMessage(translations.question),
        }),
        description: intl.formatMessage(translations.deleteEntityDescription, {
          name: question.question,
        }),
        onAccept: () =>
          deleteQuestion(question.id, {
            onSuccess: () => {
              refetchQuestions();
              showSnackbar({
                text: intl.formatMessage(translations.entityDeleted, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.question),
                }),
              });
            },
            onError: (error) => {
              Alert.alert(
                intl.formatMessage(translations.error),
                intl.formatMessage(translations.errorDescription)
              );
              console.error(
                `Unexpected error while deleting a form: ${error.message}`
              );
            },
          }),
      });
    },
    [deleteQuestion, intl, refetchQuestions, showDialog, showSnackbar]
  );
  const onClose = useCallback(() => setEditInfo(undefined), []);
  const onSave = useCallback(
    (question: QuestionFormData) => {
      saveQuestion(question, {
        onSuccess: () => {
          showSnackbar({
            text: editInfo?.question?.id
              ? intl.formatMessage(translations.changesSaved)
              : intl.formatMessage(translations.entityCreated, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.question),
                }),
          });
          onClose();
          refetchQuestions();
        },
        onError: (error) => {
          Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription)
          );
          console.error(
            `Unexpected error while deleting a form: ${error.message}`
          );
        },
      });
    },
    [
      saveQuestion,
      showSnackbar,
      editInfo?.question?.id,
      intl,
      onClose,
      refetchQuestions,
    ]
  );

  return {
    editInfo,
    questions,
    isLoading,
    onAdd,
    onEdit,
    onSave,
    onClose,
    onDelete,
  };
};
