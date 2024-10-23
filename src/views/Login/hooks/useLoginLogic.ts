import { useCallback, useState } from 'react'
import { Alert } from 'react-native'
import { supabase } from '~/services/supabase'

type LoginProps = {
    email: string
    password: string
    location: string
}

/**
 * Custom hook that provides logic and validations for the login screen.
 */
export const useLoginLogic = () => {
    const [location, setLocation] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()

    const [errors, setErrors] = useState<Partial<LoginProps>>({})

    const login = useCallback(
        async ({ email, password }: Pick<LoginProps, 'email' | 'password'>) => {
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
        [],
    )

    const onLoginPressed = useCallback(() => {
        let validationErrors = {}

        if (!location || location.trim().length === 0) {
            validationErrors = {
                ...validationErrors,
                location: 'Bitte wähle einen Standort',
            }
        }

        if (!email || email.trim().length === 0) {
            validationErrors = {
                ...validationErrors,
                email: 'Bitte gebe eine E-Mail Adresse ein',
            }
        } else if (!email.includes('@')) {
            validationErrors = {
                ...validationErrors,
                email: 'Bitte gebe eine valide E-Mail Adresse ein',
            }
        }

        if (!password || password.trim().length === 0) {
            validationErrors = {
                ...validationErrors,
                password: 'Bitte gebe ein Passwort ein',
            }
        }

        setErrors(validationErrors)

        if (Object.values(validationErrors).length > 0) return

        login({ email: email!, password: password! })
    }, [login, setErrors, location, email, password])

    const onLocationChanged = useCallback(
        (location: string) => {
            setErrors({
                ...errors,
                location: undefined,
            })
            setLocation(location)
        },
        [errors, setErrors, setLocation],
    )

    const onEmailChanged = useCallback(
        (email: string) => {
            setErrors({
                ...errors,
                email: undefined,
            })
            setEmail(email)
        },
        [errors, setErrors, setEmail],
    )

    const onPasswordChanged = useCallback(
        (password: string) => {
            setErrors({
                ...errors,
                password: undefined,
            })
            setPassword(password)
        },
        [errors, setErrors, setPassword],
    )

    return {
        errors,
        email,
        password,
        location,
        onLoginPressed,
        onLocationChanged,
        onEmailChanged,
        onPasswordChanged,
    }
}
