import { PaperProvider } from 'react-native-paper'
import AuthProvider from '~/context/AuthContext/AuthProvider'
import Main from '~/index'
import { theme } from '~/styles/theme'

const App = () => {
    return (
        <AuthProvider>
            <PaperProvider theme={theme}>
                <Main />
            </PaperProvider>
        </AuthProvider>
    )
}
export default App
