import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { IconButton } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { useAuth } from '~/context/AuthContext'
import { Page } from '~/enums/Page'
import { Role } from '~/enums/Role'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import { colors } from '~/styles/colors'
import HomeView from '~/views/Home'
import LecturerView from '~/views/Lecturer'
import ManagementOverview from '~/views/Management/Overview'
import StudentView from '~/views/Student'

const TabNavigator = () => {
    const intl = useIntl()
    const { role } = useAuth()
    const Tab = createBottomTabNavigator()

    const getIcon = useCallback((route: string) => {
        switch (route) {
            case Page.HomeView:
                return 'home'

            case Page.StudentView:
            case Page.LecturerView:
                return 'compass-outline'

            case Page.ManagementView:
                return 'cog'

            default:
                throw new Error(`Invalid Route: ${route}`)
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
                    name: Page.ManagementView,
                    component: ManagementOverview,
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
                options={{
                    headerTitle: getPageTranslation(Page.HomeView, intl),
                }}
            />
            <Tab.Screen
                name={name}
                component={component}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator
