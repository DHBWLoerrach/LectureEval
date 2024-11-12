import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import Link from '~/components/Link'
import LoadingSpinner from '~/components/LoadingSpinner'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { useDeepLTranslationMutation } from '~/queries/DeepL/useDeepLTranslationMutation'
import { useLocationQuery } from '~/queries/Location/useLocationQuery'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'

type Props = {
    department: Department | undefined
    onAddStep: () => void
    isDesigner?: boolean
}

const style = StyleSheet.create({
    buttonContent: {
        flexDirection: 'row-reverse',
    },
    content: {
        alignItems: 'center',
        flex: 1,
        gap: 30,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    heading: {
        fontSize: RFValue(24),
        fontWeight: 'bold',
    },
    linkWrapper: {
        height: 20,
    },
    text: {
        fontSize: RFValue(16),
        textAlign: 'justify',
    },
    textWrapper: {
        gap: 10,
    },
})

const PrivacyStep = ({ isDesigner = false, department, onAddStep }: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const { data: location, isLoading } = useLocationQuery({ locationId: department?.locationId })

    const { mutate: translate, data: translation, isPending } = useDeepLTranslationMutation()

    useEffect(() => {
        if (locale === Locale.DE || !location) return

        if (!location.privacy_statement || location.privacy_statement.trim().length === 0) return

        translate({ text: location.privacy_statement })
    }, [location, locale, translate])

    if (!department) return <LoadingSpinner />

    return (
        <View style={style.content}>
            <Text style={style.heading}>{intl.formatMessage(translations.privacyNotice)}</Text>
            <View style={style.textWrapper}>
                <Text style={style.text}>
                    {isPending || isLoading || (locale === Locale.EN && !translation) ? (
                        <LoadingSpinner size={20} />
                    ) : (
                        (translation ?? location?.privacy_statement ?? '')
                    )}
                </Text>
            </View>
            <View style={style.linkWrapper}>
                <Link href='https://dhbw-loerrach.de/datenschutz'>
                    {intl.formatMessage(translations.privacyMoreInfo)}
                </Link>
            </View>
            {!isDesigner && (
                <Button
                    mode='contained'
                    icon='chevron-right'
                    contentStyle={style.buttonContent}
                    onPress={onAddStep}
                >
                    {intl.formatMessage(translations.acceptAndContinue)}
                </Button>
            )}
        </View>
    )
}

export default PrivacyStep
