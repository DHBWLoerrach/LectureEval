import { PropsWithChildren, useCallback, useState } from 'react'
import { Portal, Snackbar } from 'react-native-paper'
import { SnackbarContext, SnackbarInfo } from '~/context/SnackbarContext'

type Props = PropsWithChildren

const SnackbarProvider = ({ children }: Props) => {
    const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>()

    const onDismiss = useCallback(() => {
        setSnackbarInfo(undefined)
    }, [setSnackbarInfo])

    return (
        <SnackbarContext.Provider value={{ setSnackbarInfo }}>
            {children}
            <Portal>
                {snackbarInfo && (
                    <Snackbar
                        visible
                        duration={4000}
                        onDismiss={onDismiss}
                        action={{
                            label: 'X',
                            onPress: onDismiss,
                        }}
                    >
                        {snackbarInfo.text}
                    </Snackbar>
                )}
            </Portal>
        </SnackbarContext.Provider>
    )
}

export default SnackbarProvider
