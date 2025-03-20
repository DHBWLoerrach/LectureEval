import { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useSnackbar } from '~/context/SnackbarContext';
import { QuestionType } from '~/enums/QuestionType';
import { never } from '~/helpers/never';
import { roundToTwoDigits } from '~/helpers/roundToTwoDigits';
import { useFormValuesByAssignmentQuery } from '~/queries/FormValues/useFormValuesByAssignmentQuery';
import { useQuestionsByIDQuery } from '~/queries/Questions/useQuestionsByIDQuery';
import { translations } from '~/translations/translations';
import { Question } from '~/types/Question';

export const useDetailsLogic = (courseAssignmentID: number) => {
  const intl = useIntl();
  const showSnackbar = useSnackbar();

  const {
    data: formValues,
    isLoading: formValuesLoading,
    error: formValuesError,
  } = useFormValuesByAssignmentQuery({ courseAssignmentID });

  const questionIDs = useMemo(
    () => formValues?.map((formValue) => formValue.questionID),
    [formValues]
  );

  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuestionsByIDQuery({ questionIDs });

  const groupedByQuestion = useMemo(() => {
    if (!formValues || !questions) return {};

    return formValues?.reduce(
      (acc, formValue) => {
        if (typeof questions !== 'undefined') {
          if (!acc[formValue.questionID]) {
            acc[formValue.questionID] = [];
          }
          acc[formValue.questionID].push(formValue.value);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [formValues, questions]);

  /**
   * Get the average value for each question based on a given QuestionType
   */
  const getFormValueAverages = useCallback(
    (questionType: QuestionType) => {
      return Object.fromEntries(
        Object.entries(groupedByQuestion).map(([questionID, values]) => {
          const intValues = values
            .map((value) => parseInt(value, 10))
            .filter((num) => !isNaN(num));

          const average =
            intValues.length > 0
              ? questionType === QuestionType.Rating ||
                questionType === QuestionType.Result ||
                questionType === QuestionType.Difficulty
                ? roundToTwoDigits(
                    intValues.reduce((sum, num) => sum + num, 0) /
                      intValues.length
                  )
                : intValues.reduce((sum, num) => sum + num, 0) /
                  intValues.length
              : null;

          return [
            questionID,
            average ?? intl.formatMessage(translations.notSet),
          ];
        })
      );
    },
    [groupedByQuestion, intl]
  );

  const ratingAverages = useMemo(
    () => getFormValueAverages(QuestionType.Rating),
    [getFormValueAverages]
  );
  const difficultyAverages = useMemo(
    () => getFormValueAverages(QuestionType.Difficulty),
    [getFormValueAverages]
  );

  const getFormattedString = useCallback(
    (question: Question) => {
      switch (question.typeID) {
        case QuestionType.Rating:
        case QuestionType.Result: {
          const baseString = intl.formatMessage(translations.rating);
          const value = ratingAverages[question.id];

          return value !== null && typeof value === 'number'
            ? `${baseString}: ${value} ${intl.formatMessage(translations.stars)}`
            : `${baseString}: ${intl.formatMessage(translations.notSet)}`;
        }
        case QuestionType.Difficulty: {
          const baseString = intl.formatMessage(translations.difficulty);
          const value = difficultyAverages[question.id];

          return value !== null && typeof value === 'number'
            ? `${baseString}: ${value}/3`
            : `${baseString}: ${intl.formatMessage(translations.notSet)}`;
        }
        case QuestionType.Text:
          return undefined;
        default:
          return never(
            question.typeID,
            `Unexpected question type: ${question.typeID}`
          );
      }
    },
    [difficultyAverages, intl, ratingAverages]
  );

  const questionFormValues = useMemo(() => {
    return Object.fromEntries(
      Object.entries(groupedByQuestion).map(([questionID, values]) => {
        return [questionID, values];
      })
    );
  }, [groupedByQuestion]);

  const error = useMemo(
    () => formValuesError ?? questionsError,
    [formValuesError, questionsError]
  );

  useEffect(() => {
    if (!error) return;

    Alert.alert(
      intl.formatMessage(translations.error),
      intl.formatMessage(translations.errorDescription)
    );

    console.error(error.message);
  }, [error, intl]);

  const isLoading = useMemo(
    () => formValuesLoading || questionsLoading,
    [formValuesLoading, questionsLoading]
  );

  useEffect(() => {
    if (!isLoading && (!questions || questions.length === 0)) {
      showSnackbar({
        text: intl.formatMessage(translations.noRatings),
      });
    }
  }, [intl, questions, isLoading, showSnackbar]);

  return {
    questions,
    isLoading,
    getFormattedString,
    questionFormValues,
  };
};
