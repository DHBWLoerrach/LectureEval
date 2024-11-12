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
     * Amount of stars to display
     *
     * @default 6
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

const StarsInput = ({ label, name, amount, helperText, rules, disabled }: Props) => {
    const intl = useIntl()

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        rules,
    })

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.starContainer}>
                {Array.from({ length: amount || 6 }, (_, i) => (
                    <IconButton
                        key={i}
                        size={40}
                        disabled={disabled}
                        style={styles.starButton}
                        onPress={() => onChange(i)}
                        iconColor={value >= i ? colors.primary : undefined}
                        icon={value >= i ? 'star' : 'star-outline'}
                    />
                ))}
            </View>
            <View style={styles.textContainer}>
                <Text>{intl.formatMessage(translations.agree)}</Text>
                <Text>{intl.formatMessage(translations.disagree)}</Text>
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
