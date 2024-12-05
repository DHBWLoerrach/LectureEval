import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ParamListBase, RouteProp } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LoadingSpinner from '~/components/LoadingSpinner'
import { useAuth } from '~/context/AuthContext'
import { Role } from '~/enums/Role'
import { Route } from '~/enums/Route'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import { colors } from '~/styles/colors'
import LecturerView from '~/views/Lecturer'
import LecturesView from '~/views/Lectures'
import ManagementOverview from '~/views/Management/Overview'
import StudentView from '~/views/Student'

const TabNavigator = () => {
    const intl = useIntl()
    const { role } = useAuth()
    const Tab = createBottomTabNavigator()
    const insets = useSafeAreaInsets()

    const getIcon = useCallback((route: string) => {
        switch (route) {
            case Route.LecturesView:
                return 'home'

            case Route.StudentView:
            case Route.LecturerView:
                return 'compass-outline'

            case Route.ManagementView:
                return 'cog'

            default:
                throw new Error(`Invalid Route: ${route}`)
        }
    }, [])

    const { name, component } = useMemo(() => {
        switch (role) {
            case Role.Student:
                return {
                    name: Route.StudentView,
                    component: StudentView,
                }
            case Role.Lecturer:
                return {
                    name: Route.LecturerView,
                    component: LecturerView,
                }
            case Role.Admin:
                return {
                    name: Route.ManagementView,
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
                tabBarItemStyle: { paddingBottom: insets.bottom + 5 },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
            })}
        >
            <Tab.Screen
                name={Route.LecturesView}
                component={LecturesView}
                options={{
                    headerShown: false,
                    tabBarLabel: getPageTranslation(Route.LecturesView, intl),
                }}
            />
            <Tab.Screen
                name={name}
                component={component}
                options={{ headerShown: false, tabBarLabel: getPageTranslation(name, intl) }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator
