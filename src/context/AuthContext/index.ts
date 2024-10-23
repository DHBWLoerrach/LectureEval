import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { Role } from '~/enums/Role'

type AuthContextProps = {
    session: Session | undefined
    user: User | undefined
    role: Role | undefined
}

export const AuthContext = createContext<AuthContextProps>({
    session: undefined,
    user: undefined,
    role: undefined,
})

/**
 * Provides access to the current session and user information.
 */
export const useAuth = () => useContext(AuthContext)
