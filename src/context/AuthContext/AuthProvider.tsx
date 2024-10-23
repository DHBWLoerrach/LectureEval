import { Session, User } from '@supabase/supabase-js'
import { PropsWithChildren, useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { AuthContext } from '~/context/AuthContext'
import { Role } from '~/enums/Role'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'

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
    const [user, setUser] = useState<User>()
    const [role, setRole] = useState<Role>()
    const [session, setSession] = useState<Session>()

    /**
     * Initializes the session state and subscribes to session changes.
     */
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session ?? undefined)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? undefined)
        })
    }, [])

    /**
     * Updates the user state based on the session state.
     * If the session is cleared, the user data is removed.
     */
    useEffect(() => {
        if (!session) {
            setUser(undefined)
            return
        }

        supabase.auth.getUser().then(({ data, error }) => {
            if (error) {
                console.error(error)
                return
            }

            setUser(data.user ?? undefined)
        })
    }, [session])

    /**
     * If the user state changes either refresh the current user's role or remove role data if the user was cleared.
     */
    useEffect(() => {
        if (!user) {
            setRole(undefined)
            return
        }

        supabase
            .from(Table.UserRoles)
            .select('roles(name)')
            .eq('user', user.id)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.error(error)
                    return
                }

                // @ts-expect-error (supabase type is incorrect)
                const name = data.roles.name as Role | undefined

                setRole(name)
            })
    }, [user])

    return <AuthContext.Provider value={{ session, user, role }}>{children}</AuthContext.Provider>
}

export default AuthProvider
