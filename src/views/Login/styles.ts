import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { colors } from '~/styles/colors'

export const loginStyles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'flex-end',
        display: 'flex',
    },
    card: {
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 10,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    footer: {
        padding: 30,
    },
    header: {
        alignItems: 'center',
        height: 200,
        justifyContent: 'center',
    },
    headerText: {
        color: colors.white,
        fontSize: RFValue(28),
        fontWeight: 'bold',
    },
    main: {
        flex: 1,
        gap: 25,
        padding: 30,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: `${colors.black}60`,
    },
    scrollContent: {
        flexGrow: 1,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-between',
    },
})
