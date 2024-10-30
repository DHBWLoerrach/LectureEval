import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, ImageBackground, ScrollView, View } from 'react-native'
import { Button, Card, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import Link from '~/components/Link'
import SelectMenu from '~/components/SelectMenu'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { translations } from '~/translations/translations'
import { useLoginLogic } from '~/views/Login/hooks/useLoginLogic'
import { loginStyles } from '~/views/Login/styles'

const LoginScreen = () => {
    const intl = useIntl()
    const { locale, setLocale } = useLocale()

    const {
        errors,
        email,
        location,
        password,
        onEmailChanged,
        onLocationChanged,
        onLoginPressed,
        onPasswordChanged,
    } = useLoginLogic()

    const [locations, setLocations] = useState<string[]>([])

    const loadAvailableLocations = useCallback(async () => {
        const { data, error } = await supabase.from(Table.Locations).select('*')

        if (error) {
            console.error(error)
            Alert.alert('Fehler', 'Standorte konnten nicht geladen werden.')
            return
        }

        setLocations(data.map((loc) => loc.name))
    }, [])

    /**
     * Load available locations on component mount
     */
    useEffect(() => {
        loadAvailableLocations()
    }, [loadAvailableLocations])

    const onLocaleChange = useCallback(
        (val: string) => {
            setLocale(val as Locale)
        },
        [setLocale],
    )

    return (
        <View style={loginStyles.container}>
            <ScrollView contentContainerStyle={loginStyles.scrollContent}>
                <ImageBackground
                    style={loginStyles.header}
                    source={HeaderImage}
                >
                    <View style={loginStyles.overlay} />
                    <Text style={loginStyles.headerText}>Anmelden</Text>
                </ImageBackground>
                <View style={loginStyles.wrapper}>
                    <View style={loginStyles.main}>
                        <View>
                            <SegmentedButtons
                                value={locale}
                                onValueChange={onLocaleChange}
                                buttons={[
                                    {
                                        value: Locale.DE,
                                        label: '🇩🇪 Deutsch',
                                    },
                                    {
                                        value: Locale.EN,
                                        label: '🇬🇧 English',
                                    },
                                ]}
                            />
                        </View>
                        <View>
                            <SelectMenu
                                label='Standort'
                                value={location}
                                options={locations}
                                error={!!errors.location}
                                onChange={onLocationChanged}
                            />
                            <HelperText
                                type='error'
                                padding='none'
                                visible={!!errors.location}
                            >
                                {errors.location}
                            </HelperText>
                        </View>
                        <View>
                            <TextInput
                                value={email}
                                mode='outlined'
                                label={intl.formatMessage(translations.emailLabel)}
                                error={!!errors.email}
                                onChangeText={onEmailChanged}
                            />
                            <HelperText
                                type='error'
                                padding='none'
                                visible={!!errors.email}
                            >
                                {errors.email}
                            </HelperText>
                        </View>
                        <View>
                            <TextInput
                                mode='outlined'
                                secureTextEntry
                                label={intl.formatMessage(translations.passwordLabel)}
                                value={password}
                                error={!!errors.password}
                                onChangeText={onPasswordChanged}
                            />
                            <HelperText
                                type='error'
                                padding='none'
                                visible={!!errors.password}
                            >
                                {errors.password}
                            </HelperText>
                        </View>
                        <View style={loginStyles.buttonContainer}>
                            <Button
                                mode='contained'
                                onPress={onLoginPressed}
                            >
                                Anmelden
                            </Button>
                        </View>
                    </View>
                    <View style={loginStyles.footer}>
                        <Card contentStyle={loginStyles.card}>
                            <Link href='https://dhbw-loerrach.de/impressum'>Impressum</Link>
                            <Text>|</Text>
                            <Link href='https://dhbw-loerrach.de/datenschutz'>Datenschutz</Link>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default LoginScreen
