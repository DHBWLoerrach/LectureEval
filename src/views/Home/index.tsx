import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { useAuth } from '~/context/AuthContext'
import { supabase } from '~/services/supabase'
import { translations } from '~/translations/translations'

const HomeView = () => {
    const intl = useIntl()
    const { session, role } = useAuth()

    const onLogoutPressed = useCallback(() => {
        supabase.auth.signOut()
    }, [])

    return (
        <View>
            <Text>
                Hallo {session?.user.email} ({role})
            </Text>
            <Button onPress={onLogoutPressed}>
                {intl.formatMessage(translations.logoutLabel)}
            </Button>
        </View>
    )
}

export default HomeView
