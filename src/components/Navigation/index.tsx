import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useIntl } from 'react-intl'
import TabNavigator from '~/components/Navigation/components/TabNavigator'
import { Page } from '~/enums/Page'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import FormsView from '~/views/Forms'
import FormsManagement from '~/views/Management/Forms'

const Navigation = () => {
    const intl = useIntl()
    const Stack = createNativeStackNavigator()

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Start'
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={Page.FormsView}
                    component={FormsView}
                />
                <Stack.Screen
                    name={Page.FormsManagement}
                    component={FormsManagement}
                    options={{ title: getPageTranslation(Page.FormsManagement, intl) }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
