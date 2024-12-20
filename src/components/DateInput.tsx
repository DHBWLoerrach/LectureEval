import RNDateTimePicker from '@react-native-community/datetimepicker'
import { useCallback, useState } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { HelperText, TextInput } from 'react-native-paper'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    datetimepicker: {
        backgroundColor: colors.primary,
        flex: 1,
    },
})

type Props = {
    name: string
    label?: string
    helperText?: string
    rules?: UseControllerProps['rules']
    disabled?: boolean
    defaultValue?: string
}

const DateInput = ({ label, helperText, name, rules, disabled, defaultValue }: Props) => {
    const intl = useIntl()
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        rules: {
            ...rules,
            validate: (value) => {
                // Validate the format and that the date is today or in the future
                const isValidDate = (() => {
                    const [day, month, year] = value.split('.').map(Number)
                    const date = new Date(year, month - 1, day)
                    const today = new Date()
                    today.setHours(0, 0, 0, 0) // Normalize to midnight for comparison

                    return (
                        date.getDate() === day &&
                        date.getMonth() === month - 1 &&
                        date.getFullYear() === year &&
                        date >= today // Ensure date is today or in the future
                    )
                })()
                return isValidDate || intl.formatMessage(translations.invalidDate)
            },
        },
    })

    const [show, setShow] = useState(false)
    const [date, setDate] = useState(new Date())

    const handleDateChange = useCallback(
        (value: Date) => {
            const formattedDate = value.toLocaleDateString('de-DE')
            onChange(formattedDate)
        },
        [onChange],
    )

    return (
        <View>
            <TextInput
                value={value || ''}
                label={label}
                mode='outlined'
                error={!!error}
                disabled={disabled}
                defaultValue={defaultValue}
                onPress={() => setShow((show) => !show)}
            />
            {show && (
                <RNDateTimePicker
                    value={date}
                    mode='date'
                    display='default'
                    accentColor={colors.primary}
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            setDate(selectedDate)
                            handleDateChange(selectedDate)
                            setShow(false)
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
                <HelperText
                    visible
                    type={error ? 'error' : 'info'}
                    padding='none'
                >
                    {error?.message ?? helperText}
                </HelperText>
            )}
        </View>
    )
}
export default DateInput
