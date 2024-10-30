import LoadingSpinner from '~/components/LoadingSpinner'
import Navigation from '~/components/Navigation'
import { useAuth } from '~/context/AuthContext'
import LoginView from '~/views/Login'

const Main = () => {
    const { session, isLoading } = useAuth()

    if (isLoading) return <LoadingSpinner />

    return session ? <Navigation /> : <LoginView />
}
export default Main
