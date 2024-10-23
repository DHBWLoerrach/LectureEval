import { NavigationContainer } from '@react-navigation/native'
//import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '~/context/AuthContext'
import { Role } from '~/enums/Role'
import { colors } from '~/styles/colors'
import AdminView from '~/views/Admin/AdminView'
import FormsView from '~/views/Forms/FormsView'
import HomeView from '~/views/Home/HomeView'
import LecturerView from '~/views/Lecturer/LecturerView'

//const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TabNavigator = () => {
    const { role } = useAuth()
    let name
    let component

    if (role === Role.Student) {
        name = 'Bewerten'
        component = LecturerView
    } else if (role === Role.Lecturer) {
        name = 'Ergebnisse'
        component = LecturerView
    } else if (role === Role.Admin) {
        name = 'Verwaltung'
        component = AdminView
    } //else throw new Error('Undefined Role')
    //Workaround, because Role doesn't apply immediately
    else {
        component = LecturerView
        name = 'Bewerten'
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline'
                    } else if (route.name === 'Bewerten') {
                        iconName = focused ? 'compass' : 'compass-outline'
                    } else if (route.name === 'Ergebnisse') {
                        iconName = focused ? 'compass' : 'compass-outline'
                    } else if (route.name === 'Verwaltung') {
                        iconName = focused ? 'settings' : 'settings-outline'
                    } else throw new Error('Invalid Icon')

                    // Icon-Komponente von Ionicons zurückgeben
                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    )
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
            })}
        >
            <Tab.Screen
                name='Home'
                component={HomeView}
            />
            <Tab.Screen
                name={name}
                component={component}
            />
        </Tab.Navigator>
    )
}

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Start'
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Vorlesung bewerten'
                    component={FormsView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
