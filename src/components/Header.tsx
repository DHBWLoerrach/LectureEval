import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { SegmentedButtons, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import HeaderImage from '~/../assets/header.png'
import SelectButton from '~/components/SelectButton'
import { useAuth } from '~/context/AuthContext'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { Route } from '~/enums/Route'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    element: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    headerImage: {
        height: 130,
    },
    headerText: {
        color: colors.white,
        fontSize: RFValue(24),
        fontWeight: 'bold',
        height: 60,
        textAlignVertical: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${colors.black}50`,
    },
})

const Header = () => {
    const intl = useIntl()
    const { signOut } = useAuth()
    const { locale, setLocale } = useLocale()

    const route = useRoute<RouteProp<ParamListBase, string>>()

    const options = useMemo(
        () => [
            {
                label: intl.formatMessage(translations.logout),
                iconSource: 'logout',
            },
        ],
        [intl],
    )

    const onLocaleChange = useCallback(
        (value: string) => {
            setLocale(value as Locale)
        },
        [setLocale],
    )

    const onOptionChange = useCallback(
        (selectedOption: string) => {
            if (selectedOption === intl.formatMessage(translations.logout)) signOut()
        },
        [intl, signOut],
    )

    const buttons = useMemo(
        () => [
            {
                value: Locale.DE,
                label: intl.formatMessage(translations.german),
            },
            {
                value: Locale.EN,
                label: intl.formatMessage(translations.english),
            },
        ],
        [intl],
    )

    return (
        <View>
            <ImageBackground
                style={styles.headerImage}
                source={HeaderImage}
                resizeMode='cover'
            >
                <View style={styles.overlay} />
                <View style={styles.element}>
                    <Text style={styles.headerText}>
                        {getPageTranslation(route.name as Route, intl)}
                    </Text>

                    <SelectButton
                        icon='account'
                        options={options}
                        onChange={onOptionChange}
                    >
                        <SegmentedButtons
                            value={locale}
                            buttons={buttons}
                            onValueChange={onLocaleChange}
                        />
                    </SelectButton>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Header
