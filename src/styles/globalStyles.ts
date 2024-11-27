import { StyleSheet } from 'react-native'
import { colors } from '~/styles/colors'

export const globalStyles = StyleSheet.create({
    dialog: { backgroundColor: colors.white },
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
        paddingBottom: 350,
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
})
