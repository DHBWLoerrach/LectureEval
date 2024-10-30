import { PropsWithChildren, useCallback, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { DialogContext, DialogInfo } from '~/context/DialogContext'

const styles = StyleSheet.create({
    description: {
        fontSize: 16,
    },
})

type Props = PropsWithChildren

const DialogProvider = ({ children }: Props) => {
    const [dialogInfo, setDialogInfo] = useState<DialogInfo>()

    const onDismiss = useCallback(() => {
        dialogInfo?.onDismiss?.()
        setDialogInfo(undefined)
    }, [dialogInfo])

    const onAccept = useCallback(() => {
        dialogInfo?.onAccept()
        setDialogInfo(undefined)
    }, [dialogInfo])

    return (
        <DialogContext.Provider value={{ setDialogInfo }}>
            {children}
            <Portal>
                {dialogInfo && (
                    <Dialog
                        visible
                        dismissable={false}
                    >
                        <Dialog.Title>{dialogInfo.title}</Dialog.Title>
                        <Dialog.Content>
                            <Text style={styles.description}>{dialogInfo.description}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={onDismiss}>Abbrechen</Button>
                            <Button onPress={onAccept}>Fortfahren</Button>
                        </Dialog.Actions>
                    </Dialog>
                )}
            </Portal>
        </DialogContext.Provider>
    )
}

export default DialogProvider
