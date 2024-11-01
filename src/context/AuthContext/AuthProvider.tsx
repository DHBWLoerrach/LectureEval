import { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Alert, AppState } from 'react-native'
import { AuthContext } from '~/context/AuthContext'
import { Role } from '~/enums/Role'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { translations } from '~/translations/translations'

type Props = PropsWithChildren

/**
 * Keeps the authentication state in sync while the app is in the foreground.
 * This listener should only be registered once at startup.
 */
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

/**
 * Provides the most important logic related to authentication and session management with Supabase.
 * The authentication state can be accessed using the `useAuth()` hook.
 */
const AuthProvider = ({ children }: Props) => {
    const intl = useIntl()
    const [sessionLoading, setSessionLoading] = useState(true)
    const [session, setSession] = useState<Session>()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session ?? undefined)
            setSessionLoading(false)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? undefined)
        })
    }, [])

    const {
        data: role,
        isLoading: roleLoading,
        error: roleError,
    } = useQuery<Role>({
        queryKey: [Table.Roles],
        queryFn: useCallback(async () => {
            const { data } = await supabase
                .from(Table.UserRoles)
                .select('role')
                .eq('user', session?.user.id)
                .throwOnError()
                .single()

            const { data: role } = await supabase
                .from(Table.Roles)
                .select('name')
                .eq('id', data?.role)
                .throwOnError()
                .single()

            return role?.name
        }, [session]),
        enabled: !!session,
    })

    useEffect(() => {
        if (!roleError) return

        Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription),
        )
        console.error(`Unexpected error while loading role: ${roleError.message}`)

        // Logout user to force a new login and prevent further errors
        setSession(undefined)
    }, [roleError, intl])

    const isLoading = useMemo(() => sessionLoading || roleLoading, [sessionLoading, roleLoading])

    return (
        <AuthContext.Provider value={{ session, role, isLoading }}>{children}</AuthContext.Provider>
    )
}

export default AuthProvider
