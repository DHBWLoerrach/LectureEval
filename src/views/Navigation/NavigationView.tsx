import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from '~/components/TabNavigator'
import { Page } from '~/enums/Page'
import FormsView from '~/views/Forms/FormsView'

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
                    name={Page.formsView}
                    component={FormsView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
