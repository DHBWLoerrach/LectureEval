import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { colors } from '~/styles/colors'

export const globalStyles = StyleSheet.create({
    card: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    dialog: { backgroundColor: colors.white },
    flatListContent: {
        gap: 20,
        paddingBottom: 100,
        padding: 20,
        paddingTop: 0,
    },
    list: {
        paddingBottom: 100,
    },
    listAccordion: {
        borderRadius: 10,
    },
    listAccordionTitle: {
        fontWeight: 'bold',
    },
    listAccordionWrapper: {
        backgroundColor: colors.white,
        borderColor: colors.secondary,
        borderRadius: 10,
        borderWidth: 2,
        marginBottom: 10,
        padding: 3,
    },
    listSection: {
        paddingBottom: 320,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    searchbar: {
        backgroundColor: colors.tertiary,
        marginBottom: 10,
        margin: 20,
    },
    segmentedButtons: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    subtitle: {
        fontSize: RFValue(14),
    },
    title: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
    },
})
