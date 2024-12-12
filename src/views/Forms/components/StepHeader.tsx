import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { ProgressBar, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { translations } from '~/translations/translations'
import { Step } from '~/types/Step'

type Props = {
    maxSerial: number
    step: Step | undefined
}

const styles = StyleSheet.create({
    container: {
        gap: 5,
        padding: 20,
    },
    heading: {
        fontSize: RFValue(14),
        fontWeight: 'bold',
        maxWidth: 250,
        overflow: 'hidden',
    },
    subHeading: {
        fontSize: RFValue(14),
        fontStyle: 'italic',
    },
    title: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

const StepHeader = ({ maxSerial, step }: Props) => {
    const intl = useIntl()

    const progress = useMemo(() => {
        if (!step) return 0.01

        return Math.round((step.serial / maxSerial) * 100) / 100
    }, [step, maxSerial])

    const title = useMemo(() => {
        const base = intl.formatMessage(translations.stepHeading, {
            current: (step?.serial ?? 0) + 1,
            max: maxSerial + 1,
        })

        return `${base}: ${step?.title ?? intl.formatMessage(translations.privacyNotice)}`
    }, [intl, maxSerial, step?.serial, step?.title])

    const subTitle = useMemo(() => {
        if (!step) return intl.formatMessage(translations.privacyStepSubTitle)

        return step.subTitle
    }, [intl, step])

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text
                    style={styles.heading}
                    numberOfLines={2}
                >
                    {title}
                </Text>
            </View>
            <ProgressBar progress={progress} />
            <Text style={styles.subHeading}>{subTitle}</Text>
        </View>
    )
}

export default StepHeader
