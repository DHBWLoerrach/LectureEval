import { Session } from '@supabase/supabase-js'
import { Text, View } from 'react-native'

type Props = {
    session: Session
}

const HomeView = ({ session }: Props) => {
    return (
        <View>
            <Text>Hallo {session.user.email}</Text>
        </View>
    )
}

export default HomeView
