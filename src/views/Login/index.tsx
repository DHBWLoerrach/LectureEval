import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Alert, ImageBackground, ScrollView, View } from 'react-native'
import { Button, Card, SegmentedButtons, Text } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import Link from '~/components/Link'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { supabase } from '~/services/supabase'
import { translations } from '~/translations/translations'
import { loginStyles } from '~/views/Login/styles'

type LoginModel = {
    email: string
    password: string
}

const LoginScreen = () => {
    const intl = useIntl()
    const { locale, setLocale } = useLocale()

    const form = useForm<LoginModel>()
    const {
        handleSubmit,
        formState: { isDirty },
    } = form

    const login = useCallback(
        async ({ email, password }: LoginModel) => {
            if (!isDirty) return

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error)
                Alert.alert(
                    'Login fehlgeschlagen.',
                    'Bitte prüfe deine Angaben und versuche es erneut.',
                )
        },
        [isDirty],
    )

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
                        <FormProvider {...form}>
                            <TextInput
                                name='email'
                                label={intl.formatMessage(translations.emailLabel)}
                                rules={{
                                    required: 'Bitte gebe eine E-Mail Adresse ein.',
                                    validate: (val) =>
                                        val.includes('@') ||
                                        'Bitte gebe eine gültige E-Mail Adresse ein.',
                                }}
                            />
                            <TextInput
                                name='password'
                                label='Passwort'
                                secureTextEntry
                                rules={{ required: 'Bitte gebe ein Passwort ein.' }}
                            />
                            <View style={loginStyles.buttonContainer}>
                                <Button
                                    mode='contained'
                                    disabled={!isDirty}
                                    onPress={handleSubmit(login)}
                                >
                                    Anmelden
                                </Button>
                            </View>
                        </FormProvider>
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
