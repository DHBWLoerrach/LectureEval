import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { supabase } from '~/services/supabase'
import { theme } from '~/styles/theme'
import HomeView from '~/views/Home/HomeView'
import LoginView from '~/views/Login/LoginView'

/**
 * Keep authentication state in sync while app is in foreground.
 * Should only be registered once at startup.
 */
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

const App = () => {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    return (
        <PaperProvider theme={theme}>
            {session ? <HomeView session={session} /> : <LoginView />}
        </PaperProvider>
    )
}
export default App
