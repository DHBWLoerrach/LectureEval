import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIntl } from 'react-intl';
import TabNavigator from '~/components/Navigation/components/TabNavigator';
import { Route } from '~/enums/Route';
import { getPageTranslation } from '~/helpers/getPageTranslation';
import Detail, { DetailRouteParams } from '~/views/Detail';
import FormsView, { FormsRouteParams } from '~/views/Forms';
import CoursesManagement from '~/views/Management/Courses';
import DepartmentsManagement from '~/views/Management/Departments';
import Designer, { DesignerRouteParams } from '~/views/Management/Designer';
import FormReleaseManagement from '~/views/Management/FormReleases';
import FormsManagement from '~/views/Management/Forms';
import LecturersManagement from '~/views/Management/Lecturers';
import LecturesManagement from '~/views/Management/Lectures';
import StudentsManagement from '~/views/Management/Students';

type NavigationParamList = {
  [Route.Start]: undefined;
  [Route.FormsView]: FormsRouteParams;
  [Route.FormsManagement]: undefined;
  [Route.DepartmentsManagement]: undefined;
  [Route.FormDesigner]: DesignerRouteParams;
  [Route.StudentManagement]: undefined;
  [Route.LecturerManagement]: undefined;
  [Route.LectureManagement]: undefined;
  [Route.CourseManagement]: undefined;
  [Route.DetailView]: DetailRouteParams;
  [Route.FormReleaseManagement]: undefined;
};

const Navigation = () => {
  const intl = useIntl();
  const Stack = createNativeStackNavigator<NavigationParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={Route.Start}
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Route.FormsView}
          component={FormsView}
          options={{ title: getPageTranslation(Route.FormsView, intl) }}
        />
        <Stack.Screen
          name={Route.FormsManagement}
          component={FormsManagement}
          options={{ title: getPageTranslation(Route.FormsManagement, intl) }}
        />
        <Stack.Screen
          name={Route.DepartmentsManagement}
          component={DepartmentsManagement}
          options={{
            title: getPageTranslation(Route.DepartmentsManagement, intl),
          }}
        />
        <Stack.Screen
          name={Route.FormDesigner}
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
          options={{
            title: getPageTranslation(Route.LecturerManagement, intl),
          }}
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
        <Stack.Screen
          name={Route.FormReleaseManagement}
          component={FormReleaseManagement}
          options={{
            title: getPageTranslation(Route.FormReleaseManagement, intl),
          }}
        />
        <Stack.Screen
          name={Route.DetailView}
          component={Detail}
          options={{ title: getPageTranslation(Route.DetailView, intl) }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
