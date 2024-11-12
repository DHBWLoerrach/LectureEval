import { PropsWithChildren, useCallback } from 'react'
import { useIntl } from 'react-intl'
// eslint-disable-next-line no-restricted-imports
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { translations } from '~/translations/translations'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    link: {
        textDecorationLine: 'underline',
    },
})

type Props = PropsWithChildren<{
    href: string
}>

const Link = ({ href, children }: Props) => {
    const intl = useIntl()

    const openLink = useCallback(async () => {
        const supported = await Linking.canOpenURL(href)

        if (!supported) {
            Alert.alert(
                intl.formatMessage(translations.error),
                intl.formatMessage(translations.errorDescription),
            )
            return
        }

        await Linking.openURL(href)
    }, [href, intl])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openLink}>
                <Text style={styles.link}>{children}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Link
