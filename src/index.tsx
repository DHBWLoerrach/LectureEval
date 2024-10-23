import { useAuth } from '~/context/AuthContext'
import HomeView from '~/views/Home/HomeView'
import LoginView from '~/views/Login/LoginView'

const Main = () => {
    const { session } = useAuth()

    return session ? <HomeView /> : <LoginView />
}
export default Main
