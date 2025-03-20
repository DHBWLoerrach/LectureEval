import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import DifficultyInput from '~/components/DifficultyInput';
import LoadingSpinner from '~/components/LoadingSpinner';
import StarsInput from '~/components/StarsInput';
import TextInput from '~/components/TextInput';
import { useLocale } from '~/context/LocaleContext';
import { Locale } from '~/enums/Locale';
import { QuestionType } from '~/enums/QuestionType';
import { useDeepLTranslationMutation } from '~/queries/DeepL/useDeepLTranslationMutation';
import { translations } from '~/translations/translations';
import { Question as TQuestion } from '~/types/Question';

type Props = {
  question: TQuestion;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
  },
  divider: {
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: RFValue(13),
    fontWeight: 'bold',
  },
});

const Question = ({ question }: Props) => {
  const intl = useIntl();
  const { locale } = useLocale();

  const {
    mutate: translate,
    data: translation,
    isPending,
  } = useDeepLTranslationMutation();

  useEffect(() => {
    if (locale === Locale.DE) return;

    if (!question.question || question.question.trim().length === 0) return;

    translate({ text: question.question });
  }, [question, translate, locale]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>
          {isPending ? (
            <LoadingSpinner size={20} />
          ) : (
            (translation ?? question.question)
          )}
        </Text>
      </View>
      {question.typeID === QuestionType.Rating && (
        <StarsInput
          name={question.id.toString()}
          rules={{
            required: question.isRequired
              ? intl.formatMessage(translations.required)
              : undefined,
          }}
        />
      )}
      {question.typeID === QuestionType.Text && (
        <TextInput
          multiline
          name={question.id.toString()}
          rules={{
            required: question.isRequired
              ? intl.formatMessage(translations.required)
              : undefined,
          }}
        />
      )}
      {question.typeID === QuestionType.Difficulty && (
        <DifficultyInput
          name={question.id.toString()}
          rules={{ required: intl.formatMessage(translations.required) }}
        />
      )}
      {question.typeID === QuestionType.Result && (
        <StarsInput
          isResult
          name={question.id.toString()}
          rules={{
            required: intl.formatMessage(translations.required),
          }}
        />
      )}
      <Divider style={styles.divider} />
    </View>
  );
};
export default Question;
