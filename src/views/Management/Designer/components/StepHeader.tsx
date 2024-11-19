import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { IconButton, ProgressBar, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { translations } from '~/translations/translations'
import { Step } from '~/types/Step'

type Props = {
    maxSerial: number
    step: Step | undefined
    onEdit: (step: Step) => void
    onDelete: (step: Step) => void
}

const styles = StyleSheet.create({
    buttonWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
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

const StepHeader = ({ maxSerial, step, onEdit: onEditProp, onDelete: onDeleteProp }: Props) => {
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

    const onEdit = useCallback(() => {
        if (!step) return

        onEditProp(step)
    }, [onEditProp, step])

    const onDelete = useCallback(() => {
        if (!step) return

        onDeleteProp(step)
    }, [onDeleteProp, step])

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text
                    style={styles.heading}
                    numberOfLines={2}
                >
                    {title}
                </Text>
                {!!step && (
                    <View style={styles.buttonWrapper}>
                        <IconButton
                            size={16}
                            icon='pencil'
                            onPress={onEdit}
                            mode='contained-tonal'
                        />
                        <IconButton
                            size={16}
                            icon='trash-can'
                            onPress={onDelete}
                            mode='contained-tonal'
                        />
                    </View>
                )}
            </View>
            <ProgressBar progress={progress} />
            <Text style={styles.subHeading}>{subTitle}</Text>
        </View>
    )
}

export default StepHeader
