import { useCallback } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { useAuth } from '~/context/AuthContext'
import { supabase } from '~/services/supabase'

const HomeView = () => {
    const { session, role } = useAuth()

    const onLogoutPressed = useCallback(() => {
        supabase.auth.signOut()
    }, [])

    return (
        <View>
            <Text>
                Hallo {session?.user.email} ({role})
            </Text>
            <Button onPress={onLogoutPressed}>Abmelden</Button>
        </View>
    )
}

export default HomeView
