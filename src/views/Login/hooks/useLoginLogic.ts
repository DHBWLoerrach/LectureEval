import { useCallback } from 'react'
import { Alert } from 'react-native'
import { supabase } from '~/services/supabase'

type LoginProps = {
    email: string
    password: string
}

export const useLoginLogic = () => {
    const login = useCallback(async ({ email, password }: LoginProps) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) Alert.alert(error.message)
    }, [])

    return {
        login,
    }
}
