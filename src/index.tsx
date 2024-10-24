import { useAuth } from '~/context/AuthContext'
import LoginView from '~/views/Login'
import Navigation from '~/views/Navigation'

const Main = () => {
    const { session } = useAuth()

    return session ? <Navigation /> : <LoginView />
}
export default Main
