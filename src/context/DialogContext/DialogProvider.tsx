import { PropsWithChildren, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet, Text } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'
import { DialogContext, DialogInfo } from '~/context/DialogContext'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    description: {
        fontSize: 16,
    },
})

type Props = PropsWithChildren

const DialogProvider = ({ children }: Props) => {
    const intl = useIntl()
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
                            <Button onPress={onDismiss}>
                                {intl.formatMessage(translations.cancel)}
                            </Button>
                            <Button onPress={onAccept}>
                                {intl.formatMessage(translations.continue)}
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                )}
            </Portal>
        </DialogContext.Provider>
    )
}

export default DialogProvider
