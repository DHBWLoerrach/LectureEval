import { useAuth } from '~/context/AuthContext'
import Navigation from '~/navigation'
import LoginView from '~/views/Login/LoginView'

const Main = () => {
    const { session } = useAuth()

    return session ? <Navigation /> : <LoginView />
}
export default Main
