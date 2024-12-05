import { StyleSheet } from 'react-native'
import { colors } from '~/styles/colors'

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.transparent,
        borderWidth: 0,
    },
    card: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    listSection: {
        paddingBottom: 280,
        paddingHorizontal: 20,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: colors.black,
        paddingLeft: 25,
        width: '65%',
    },
    title: {
        fontWeight: 'bold',
        maxWidth: 200,
        paddingBottom: 5,
    },
})

export default styles
