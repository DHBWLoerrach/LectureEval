import { StyleSheet } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { colors } from '~/styles/colors'

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
})

const LoadingSpinner = () => {
    return (
        <ActivityIndicator
            style={styles.loadingContainer}
            size='large'
            color={colors.secondary}
        />
    )
}

export default LoadingSpinner
