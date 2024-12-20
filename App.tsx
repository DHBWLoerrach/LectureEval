import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthProvider from '~/context/AuthContext/AuthProvider'
import DialogProvider from '~/context/DialogContext/DialogProvider'
import LocaleProvider from '~/context/LocaleContext/LocaleProvider'
import SnackbarProvider from '~/context/SnackbarContext/SnackbarProvider'
import Main from '~/index'
import { colors } from '~/styles/colors'
import { globalStyles } from '~/styles/globalStyles'
import { theme } from '~/styles/theme'

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: true,
            },
        },
    })
    return (
        <SafeAreaView style={globalStyles.flexBox}>
            <LocaleProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <PaperProvider theme={theme}>
                            <StatusBar
                                animated
                                style='dark'
                                hidden={false}
                                backgroundColor={colors.white}
                            />
                            <DialogProvider>
                                <SnackbarProvider>
                                    <Main />
                                </SnackbarProvider>
                            </DialogProvider>
                        </PaperProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </LocaleProvider>
        </SafeAreaView>
    )
}
export default App
