import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { IconButton } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { useAuth } from '~/context/AuthContext'
import { Page } from '~/enums/Page'
import { Role } from '~/enums/Role'
import { colors } from '~/styles/colors'
import AdminView from '~/views/Admin'
import HomeView from '~/views/Home'
import LecturerView from '~/views/Lecturer'
import StudentView from '~/views/Student'

const TabNavigator = () => {
    const { role } = useAuth()
    const Tab = createBottomTabNavigator()

    const getIcon = useCallback((routename: string) => {
        switch (routename) {
            case Page.HomeView:
                return 'home'

            case Page.StudentView:
                return 'compass-outline'

            case Page.LecturerView:
                return 'compass-outline'

            case Page.AdminView:
                return 'cog'

            default:
                throw new Error('Invalid Route')
        }
    }, [])

    const { name, component } = useMemo(() => {
        switch (role) {
            case Role.Student:
                return {
                    name: Page.StudentView,
                    component: StudentView,
                }
            case Role.Lecturer:
                return {
                    name: Page.LecturerView,
                    component: LecturerView,
                }
            case Role.Admin:
                return {
                    name: Page.AdminView,
                    component: AdminView,
                }
            default:
                return { name: null, component: null }
        }
    }, [role])

    if (!role || !name) {
        return <LoadingSpinner />
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
                tabBarIcon: ({ size, color }) => (
                    <IconButton
                        icon={getIcon(route.name)}
                        size={size}
                        iconColor={color}
                    />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
            })}
        >
            <Tab.Screen
                name={Page.HomeView}
                component={HomeView}
            />
            <Tab.Screen
                name={name}
                component={component}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator
