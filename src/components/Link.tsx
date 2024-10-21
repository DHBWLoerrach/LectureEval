import { PropsWithChildren, useCallback } from 'react'
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
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
    const openLink = useCallback(async () => {
        const supported = await Linking.canOpenURL(href)

        if (!supported) {
            Alert.alert('Unexpected: Link cannot be opened.')
            return
        }

        await Linking.openURL(href)
    }, [href])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openLink}>
                <Text style={styles.link}>{children}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Link
