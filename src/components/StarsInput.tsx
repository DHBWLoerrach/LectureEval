import { useMemo } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { HelperText, IconButton, Text } from 'react-native-paper'
import { RFPercentage } from 'react-native-responsive-fontsize'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'

type Props = {
    name: string
    /**
     * Indicates if the Question is of Type 'Difficulty'.
     */
    isDifficulty?: boolean
    /**
     * Indicates if the Question monitors the overall result.
     */
    isResult?: boolean
    label?: string
    helperText?: string
    rules?: UseControllerProps['rules']
    disabled?: boolean
    /**
     * Amount of stars to display
     *
     * @default 5
     */
    amount?: number
}

const styles = StyleSheet.create({
    label: {
        fontSize: RFPercentage(16),
        fontWeight: 'bold',
    },
    starButton: {
        margin: 0,
        padding: 0,
    },
    starContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

const StarsInput = ({
    label,
    name,
    amount,
    helperText,
    rules,
    disabled,
    isDifficulty = false,
    isResult = false,
}: Props) => {
    const intl = useIntl()
    if (isDifficulty && isResult) {
        throw new Error('Can not be both, result and difficulty')
    }

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        rules,
    })

    const defaultAmount = useMemo(() => (isDifficulty ? 3 : 5), [isDifficulty])

    const starButtons = useMemo(() => {
        return Array.from({ length: amount || defaultAmount }, (_, i) => {
            const key = i + 1

            return (
                <IconButton
                    key={key}
                    size={40}
                    disabled={disabled}
                    style={styles.starButton}
                    onPress={() => onChange(key)}
                    iconColor={value >= key ? colors.primary : undefined}
                    icon={
                        isDifficulty
                            ? value >= key
                                ? 'alert-circle'
                                : 'alert-circle-outline'
                            : value >= key
                              ? 'star'
                              : 'star-outline'
                    }
                />
            )
        })
    }, [amount, defaultAmount, disabled, value, onChange, isDifficulty])

    const leftText = useMemo(() => {
        if (isResult) {
            return intl.formatMessage(translations.bad)
        }
        return isDifficulty
            ? intl.formatMessage(translations.easy)
            : intl.formatMessage(translations.disagree)
    }, [isResult, isDifficulty, intl])

    const rightText = useMemo(() => {
        if (isResult) {
            return intl.formatMessage(translations.good)
        }
        return isDifficulty
            ? intl.formatMessage(translations.hard)
            : intl.formatMessage(translations.agree)
    }, [isResult, isDifficulty, intl])

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.starContainer}>{starButtons}</View>
            <View style={styles.textContainer}>
                <Text>{leftText}</Text>
                <Text>{rightText}</Text>
            </View>
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

export default StarsInput
