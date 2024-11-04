import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import SelectButton from '~/components/SelectButton'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { Page } from '~/enums/Page'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import { supabase } from '~/services/supabase'
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
        fontSize: 30,
        fontWeight: 'bold',
        height: 60,
        textAlignVertical: 'center',
    },
    headerTop: {
        backgroundColor: colors.white,
        height: 35,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${colors.black}50`,
    },
})

const Header = () => {
    const intl = useIntl()
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
            if (selectedOption === intl.formatMessage(translations.logout)) {
                supabase.auth.signOut()
            }
        },
        [intl],
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
            <View style={styles.headerTop} />
            <ImageBackground
                style={styles.headerImage}
                source={HeaderImage}
                resizeMode='cover'
            >
                <View style={styles.overlay} />
                <View style={styles.element}>
                    <Text style={styles.headerText}>
                        {getPageTranslation(route.name as Page, intl)}
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
