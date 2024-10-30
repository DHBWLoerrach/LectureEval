import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from '~/components/Navigation/components/TabNavigator'
import { Page } from '~/enums/Page'
import FormsView from '~/views/Forms'
import FormsManagement from '~/views/Management/Forms'

const Navigation = () => {
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
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
