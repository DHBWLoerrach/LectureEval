import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { StyleSheet, View } from 'react-native';
import Button from '~/components/Button';
import { translations } from '~/translations/translations';

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row-reverse',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});

type Props = {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

const StepFooter = ({
  isFirst,
  isLast,
  onNext: onNextProp,
  onPrev,
  onSubmit: onSubmitProp,
}: Props) => {
  const intl = useIntl();

  const { trigger } = useFormContext();

  const onNext = useCallback(() => {
    trigger().then((isValid) => {
      if (!isValid) return;

      onNextProp();
    });
  }, [onNextProp, trigger]);

  const onSubmit = useCallback(() => {
    trigger().then((isValid) => {
      if (!isValid) return;

      onSubmitProp();
    });
  }, [onSubmitProp, trigger]);

  return (
    <View style={styles.container}>
      {isFirst && (
        <Button
          mode="contained"
          icon="chevron-left"
          onPress={onPrev}
          disabled={true}
        >
          {intl.formatMessage(translations.back)}
        </Button>
      )}
      {!isFirst && (
        <Button mode="contained" icon="chevron-left" onPress={onPrev}>
          {intl.formatMessage(translations.back)}
        </Button>
      )}
      <Button
        mode="contained"
        icon={!isLast ? 'chevron-right' : ''}
        contentStyle={styles.buttonContent}
        onPress={!isLast ? onNext : onSubmit}
      >
        {isLast
          ? intl.formatMessage(translations.submit)
          : intl.formatMessage(translations.next)}
      </Button>
    </View>
  );
};

export default StepFooter;
