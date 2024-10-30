import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PaperProvider } from 'react-native-paper'
import AuthProvider from '~/context/AuthContext/AuthProvider'
import DialogProvider from '~/context/DialogContext/DialogProvider'
import LocaleProvider from '~/context/LocaleContext/components/LocaleProvider'
import SnackbarProvider from '~/context/SnackbarContext/SnackbarProvider'
import Main from '~/index'
import { theme } from '~/styles/theme'

const App = () => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LocaleProvider>
                    <PaperProvider theme={theme}>
                        <DialogProvider>
                            <SnackbarProvider>
                                <Main />
                            </SnackbarProvider>
                        </DialogProvider>
                    </PaperProvider>
                </LocaleProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
export default App
