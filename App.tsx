import { PaperProvider } from 'react-native-paper'
import AuthProvider from '~/context/AuthContext/AuthProvider'
import LocaleProvider from '~/context/LocaleContext/components/LocaleProvider'
import Main from '~/index'
import { theme } from '~/styles/theme'

const App = () => {
    return (
        <AuthProvider>
            <LocaleProvider>
                <PaperProvider theme={theme}>
                    <Main />
                </PaperProvider>
            </LocaleProvider>
        </AuthProvider>
    )
}
export default App
