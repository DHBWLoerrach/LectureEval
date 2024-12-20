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
    label?: string
    helperText?: string
    rules?: UseControllerProps['rules']
    disabled?: boolean
    /**
     * Amount of icons to display
     *
     * @default 3
     */
    amount?: number
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    label: {
        fontSize: RFPercentage(16),
        fontWeight: 'bold',
    },
    starButton: {
        margin: 0,
        padding: 0,
    },
    textContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

const DifficultyInput = ({ label, name, amount = 3, helperText, rules, disabled }: Props) => {
    const intl = useIntl()

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        rules,
    })

    const iconButtons = useMemo(() => {
        return Array.from({ length: amount }, (_, i) => {
            const key = i + 1

            return (
                <IconButton
                    key={key}
                    size={40}
                    disabled={disabled}
                    style={styles.starButton}
                    onPress={() => onChange(key)}
                    iconColor={value >= key ? colors.primary : undefined}
                    icon={value >= key ? 'alert-circle' : 'alert-circle-outline'}
                />
            )
        })
    }, [amount, disabled, value, onChange])

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.iconContainer}>{iconButtons}</View>
            <View style={styles.textContainer}>
                <Text>{intl.formatMessage(translations.easy)}</Text>
                <Text>{intl.formatMessage(translations.hard)}</Text>
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

export default DifficultyInput
