import { DefaultTheme } from 'react-native-paper'
import { colors } from '~/styles/colors'

/**
 * Customized theme for react-native-paper
 */
export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        accent: colors.secondary,
        background: colors.white,
        surface: colors.secondary,
    },
}
