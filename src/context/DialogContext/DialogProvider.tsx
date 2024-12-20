import { PropsWithChildren, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { Dialog, Portal, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import Button from '~/components/Button'
import { DialogContext, DialogInfo } from '~/context/DialogContext'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    content: { gap: 10 },
    description: {
        fontSize: RFValue(13),
    },
})

type Props = PropsWithChildren

/**
 * Provides a simple hook to show a dialog with a title and description without the need to pass the dialog info through props.
 */
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
                        style={globalStyles.dialog}
                    >
                        <Dialog.Title>{dialogInfo.title}</Dialog.Title>
                        <Dialog.Content style={styles.content}>
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
