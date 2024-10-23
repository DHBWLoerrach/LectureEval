import { StyleSheet } from 'react-native'
import { colors } from '~/styles/colors'

export const studentStyles = StyleSheet.create({
    headerText: {
        color: colors.white,
        fontSize: 36,
        fontWeight: 'bold',
    },
    image: {
        alignItems: 'center',
        display: 'flex',
        height: 250,
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${colors.black}60`,
    },
})
