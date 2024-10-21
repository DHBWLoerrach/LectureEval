import { DefaultTheme } from 'react-native-paper'
import { colors } from '~/styles/colors'

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        accent: colors.secondary,
    },
}
