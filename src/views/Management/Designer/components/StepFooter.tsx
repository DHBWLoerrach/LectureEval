import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    buttonContent: {
        flexDirection: 'row-reverse',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
})

type Props = {
    isFirst: boolean
    isLast: boolean
    editable: boolean
    onPrev: () => void
    onNext: () => void
}

const StepFooter = ({ editable, isFirst, isLast, onNext, onPrev }: Props) => {
    const intl = useIntl()

    return (
        <View style={styles.container}>
            <Button
                mode='contained'
                icon='chevron-left'
                onPress={onPrev}
                disabled={isFirst}
            >
                {intl.formatMessage(translations.back)}
            </Button>
            <Button
                mode='contained'
                icon={editable && isLast ? 'plus' : 'chevron-right'}
                disabled={!editable && isLast}
                contentStyle={styles.buttonContent}
                onPress={onNext}
            >
                {editable && isLast
                    ? intl.formatMessage(translations.addStep)
                    : intl.formatMessage(translations.next)}
            </Button>
        </View>
    )
}

export default StepFooter
