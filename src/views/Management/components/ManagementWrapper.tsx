import { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'

const styles = StyleSheet.create({
    fab: {
        bottom: 0,
        margin: 24,
        position: 'absolute',
        right: 0,
    },
    flexBox: {
        flex: 1,
    },
})

type Props = PropsWithChildren<{
    /**
     * Whether or not a loading spinner should be displayed
     *
     * @default false
     */
    loading?: boolean
    /**
     * Whether or not a FAB should be displayed
     *
     * @default true
     */
    fab?: boolean
    /**
     * FAB action callback
     */
    onFab?: () => void
}>

const ManagementWrapper = ({ children, fab = true, loading = false, onFab }: Props) => {
    return (
        <ScrollView contentContainerStyle={styles.flexBox}>
            <View style={styles.flexBox}>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <View style={styles.flexBox}>
                        {children}
                        {fab && (
                            <FAB
                                icon='plus'
                                style={styles.fab}
                                onPress={onFab}
                            />
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default ManagementWrapper
