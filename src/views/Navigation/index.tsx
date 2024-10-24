import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Page } from '~/enums/Page'
import FormsView from '~/views/Forms'
import TabNavigator from '~/views/Navigation/components/TabNavigator'

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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
