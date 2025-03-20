import RNDateTimePicker from '@react-native-community/datetimepicker';
import { formatInTimeZone } from 'date-fns-tz';
import { isAfter } from 'date-fns/isAfter';
import { isEqual } from 'date-fns/isEqual';
import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';
import { startOfDay } from 'date-fns/startOfDay';
import { useCallback, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { StyleSheet, View } from 'react-native';
// eslint-disable-next-line no-restricted-imports
import { HelperText, TextInput } from 'react-native-paper';
import { colors } from '~/styles/colors';
import { translations } from '~/translations/translations';

const styles = StyleSheet.create({
  datetimepicker: {
    backgroundColor: colors.primary,
    flex: 1,
  },
});

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  rules?: UseControllerProps['rules'];
  disabled?: boolean;
  defaultValue?: string;
};

const DateInput = ({
  label,
  helperText,
  name,
  rules,
  disabled,
  defaultValue,
}: Props) => {
  const intl = useIntl();
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: {
      ...rules,
      validate: (value) => {
        // Validate the format and that the date is today or in the future
        const today = startOfDay(new Date());
        const date = startOfDay(parse(value, 'dd.MM.yyyy', new Date()));

        const isValidDate =
          isValid(date) && (isEqual(date, today) || isAfter(date, today));

        return isValidDate || intl.formatMessage(translations.invalidDate);
      },
    },
  });

  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = useCallback(
    (value: Date) => {
      const date = formatInTimeZone(value, 'Europe/Berlin', 'dd.MM.yyyy');
      onChange(date);
    },
    [onChange]
  );

  return (
    <View>
      <TextInput
        value={value || ''}
        label={label}
        mode="outlined"
        error={!!error}
        disabled={disabled}
        defaultValue={defaultValue}
        onPress={() => setShow((show) => !show)}
      />
      {show && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display="default"
          accentColor={colors.primary}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              handleDateChange(selectedDate);
              setShow(false);
            }
          }}
          minimumDate={new Date(2024, 0, 1)}
          timeZoneName={'Europe/Berlin'}
          positiveButton={{
            label: intl.formatMessage(translations.save),
          }}
          negativeButton={{
            label: intl.formatMessage(translations.cancel),
          }}
          style={styles.datetimepicker}
        />
      )}
      {(helperText || error) && (
        <HelperText visible type={error ? 'error' : 'info'} padding="none">
          {error?.message ?? helperText}
        </HelperText>
      )}
    </View>
  );
};
export default DateInput;
