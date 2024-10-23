import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IconButton } from 'react-native-paper'
import { useAuth } from '~/context/AuthContext'
import { Role } from '~/enums/Role'
import { colors } from '~/styles/colors'
import AdminView from '~/views/Admin/AdminView'
import FormsView from '~/views/Forms/FormsView'
import HomeView from '~/views/Home/HomeView'
import LecturerView from '~/views/Lecturer/LecturerView'
import StudentView from '~/views/Student/StudentView'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

enum views {
    studentView = 'Bewerten',
    lecturerView = 'Ergebnisse',
    adminView = 'Verwaltung',
    homeView = 'Home',
    formsView = 'Vorlesung bewerten',
}

const GetIconName = (routename: any) => {
    let iconName

    switch (routename) {
        case views.homeView: {
            iconName = 'home'
            break
        }
        case views.studentView: {
            iconName = 'compass-outline'
            break
        }
        case views.lecturerView: {
            iconName = 'compass-outline'
            break
        }
        case views.adminView: {
            iconName = 'cog'
            break
        }
        default: {
            throw new Error('Invalid Route')
        }
    }
    return iconName
}

const TabNavigator = () => {
    const { role } = useAuth()
    let name
    let component

    switch (role) {
        case Role.Student: {
            name = views.studentView
            component = StudentView
            break
        }
        case Role.Lecturer: {
            name = views.lecturerView
            component = LecturerView
            break
        }
        case Role.Admin: {
            name = views.adminView
            component = AdminView
            break
        }
        //Workaround, because Role doesn't apply immediately
        default: {
            component = StudentView
            name = views.studentView
        }
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ size, color }) => {
                    const iconName = GetIconName(route.name)

                    return (
                        <IconButton
                            icon={iconName}
                            size={size}
                            iconColor={color}
                        />
                    )
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
            })}
        >
            <Tab.Screen
                name={views.homeView}
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
                    name={views.formsView}
                    component={FormsView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
