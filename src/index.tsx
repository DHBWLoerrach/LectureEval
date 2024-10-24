import { useAuth } from '~/context/AuthContext'
import LoginView from '~/views/Login/LoginView'
import Navigation from '~/views/Navigation/NavigationView'

const Main = () => {
    const { session } = useAuth()

    return session ? <Navigation /> : <LoginView />
}
export default Main
