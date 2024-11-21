import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Alert, ImageBackground, ScrollView, View } from 'react-native'
import { Card, SegmentedButtons, Text } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import Button from '~/components/Button'
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
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    useEffect(() => {
        if (!isDirty) return

        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

    const login = useCallback(
        async ({ email, password }: LoginModel) => {
            if (!isDirty) return

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error)
                Alert.alert(
                    intl.formatMessage(translations.loginError),
                    intl.formatMessage(translations.loginErrorDescription),
                )
        },
        [isDirty, intl],
    )

    const onLocaleChange = useCallback((val: string) => setLocale(val as Locale), [setLocale])

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

    const validate = useCallback(
        (val: string) => {
            return val.includes('@') || intl.formatMessage(translations.invalidEmail)
        },
        [intl],
    )

    return (
        <View style={loginStyles.container}>
            <ScrollView contentContainerStyle={loginStyles.scrollContent}>
                <ImageBackground
                    style={loginStyles.header}
                    source={HeaderImage}
                >
                    <View style={loginStyles.overlay} />
                    <Text style={loginStyles.headerText}>
                        {intl.formatMessage(translations.loginTitle)}
                    </Text>
                </ImageBackground>
                <View style={loginStyles.wrapper}>
                    <View style={loginStyles.main}>
                        <View>
                            <SegmentedButtons
                                value={locale}
                                buttons={buttons}
                                onValueChange={onLocaleChange}
                            />
                        </View>
                        <FormProvider {...form}>
                            <TextInput
                                name='email'
                                label={intl.formatMessage(translations.emailAdress)}
                                rules={{
                                    required: intl.formatMessage(translations.required),
                                    validate,
                                }}
                            />
                            <TextInput
                                name='password'
                                label={intl.formatMessage(translations.password)}
                                secureTextEntry
                                rules={{ required: intl.formatMessage(translations.required) }}
                            />
                            <View style={loginStyles.buttonContainer}>
                                <Button
                                    mode='contained'
                                    onPress={handleSubmit(login)}
                                    disabled={!isDirty}
                                >
                                    {intl.formatMessage(translations.loginTitle)}
                                </Button>
                            </View>
                        </FormProvider>
                    </View>
                    <View style={loginStyles.footer}>
                        <Card
                            contentStyle={loginStyles.card}
                            mode='contained'
                        >
                            <Link href='https://dhbw-loerrach.de/impressum'>
                                {intl.formatMessage(translations.imprint)}
                            </Link>
                            <Text>|</Text>
                            <Link href='https://dhbw-loerrach.de/datenschutz'>
                                {intl.formatMessage(translations.privacy)}
                            </Link>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default LoginScreen
