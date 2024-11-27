import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useIntl } from 'react-intl'
import TabNavigator from '~/components/Navigation/components/TabNavigator'
import { Route } from '~/enums/Route'
import { getPageTranslation } from '~/helpers/getPageTranslation'
import FormsView from '~/views/Forms'
import CoursesManagement from '~/views/Management/Courses'
import DepartmentsManagement from '~/views/Management/Departments'
import Designer from '~/views/Management/Designer'
import FormsManagement from '~/views/Management/Forms'
import LecturersManagement from '~/views/Management/Lecturers'
import LecturesManagement from '~/views/Management/Lectures'
import StudentsManagement from '~/views/Management/Students'

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
                    name={Route.FormsView}
                    component={FormsView}
                />
                <Stack.Screen
                    name={Route.FormsManagement}
                    component={FormsManagement}
                    options={{ title: getPageTranslation(Route.FormsManagement, intl) }}
                />
                <Stack.Screen
                    name={Route.DepartmentsManagement}
                    component={DepartmentsManagement}
                    options={{ title: getPageTranslation(Route.DepartmentsManagement, intl) }}
                />
                <Stack.Screen
                    name={Route.FormDesigner}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    component={Designer}
                    initialParams={{ formId: 0 }}
                    options={{ title: getPageTranslation(Route.FormDesigner, intl) }}
                />
                <Stack.Screen
                    name={Route.StudentManagement}
                    component={StudentsManagement}
                    options={{ title: getPageTranslation(Route.StudentManagement, intl) }}
                />
                <Stack.Screen
                    name={Route.LecturerManagement}
                    component={LecturersManagement}
                    options={{ title: getPageTranslation(Route.LecturerManagement, intl) }}
                />
                <Stack.Screen
                    name={Route.LectureManagement}
                    component={LecturesManagement}
                    options={{ title: getPageTranslation(Route.LectureManagement, intl) }}
                />
                <Stack.Screen
                    name={Route.CourseManagement}
                    component={CoursesManagement}
                    options={{ title: getPageTranslation(Route.CourseManagement, intl) }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation
