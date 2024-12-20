import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { globalStyles } from '~/styles/globalStyles'

const styles = StyleSheet.create({
    fab: {
        bottom: 0,
        margin: 24,
        position: 'absolute',
        right: 0,
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
        <View style={globalStyles.flexBox}>
            <View style={globalStyles.flexBox}>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <View style={globalStyles.flexBox}>
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
        </View>
    )
}

export default ManagementWrapper
