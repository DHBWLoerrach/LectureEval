import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useDialog } from '~/context/DialogContext';
import { useSnackbar } from '~/context/SnackbarContext';
import { useCoursesQuery } from '~/queries/Courses/useCoursesQuery';
import { useDeleteCourseMutation } from '~/queries/Courses/useDeleteCourseMutation';
import { useUpsertCourseMutation } from '~/queries/Courses/useUpsertCourseMutation';
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery';
import { translations } from '~/translations/translations';
import { Course } from '~/types/Course';
import { CourseFormData } from '~/views/Management/Courses/types/CourseFormData';

export const useCourseManagementLogic = () => {
  const intl = useIntl();

  const showDialog = useDialog();
  const showSnackbar = useSnackbar();

  const [editInfo, setEditInfo] = useState<{ initialData?: Course }>();

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartmentsQuery();

  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCoursesQuery();

  const { mutate: saveCourse } = useUpsertCourseMutation();
  const { mutate: deleteCourse } = useDeleteCourseMutation();

  const onSave = useCallback(
    (course: CourseFormData) => {
      saveCourse(course, {
        onSuccess: () => {
          refetchCourses();
          setEditInfo(undefined);
          showSnackbar({
            text: course.name
              ? intl.formatMessage(translations.changesSaved)
              : intl.formatMessage(translations.entityCreated, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.course),
                }),
          });
        },
        onError: (error) => {
          Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription)
          );
          console.error(
            `Unexpected error while saving a course: ${error.message}`
          );
        },
      });
    },
    [saveCourse, refetchCourses, showSnackbar, intl]
  );

  const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo]);

  const onDelete = useCallback(
    (course: Course) => {
      showDialog({
        title: intl.formatMessage(translations.deleteEntityHeader, {
          entity: intl.formatMessage(translations.course),
        }),
        description: intl.formatMessage(translations.deleteEntityDescription, {
          name: course.name,
        }),
        onAccept: () =>
          deleteCourse(course.id, {
            onSuccess: () => {
              refetchCourses();
              showSnackbar({
                text: intl.formatMessage(translations.entityDeleted, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.course),
                }),
              });
            },
            onError: (error) => {
              Alert.alert(
                intl.formatMessage(translations.error),
                intl.formatMessage(translations.errorDescription)
              );
              console.error(
                `Unexpected error while deleting a course: ${error.message}`
              );
            },
          }),
      });
    },
    [showDialog, deleteCourse, refetchCourses, showSnackbar, intl]
  );

  const onEdit = useCallback(
    (course: Course) => setEditInfo({ initialData: course }),
    []
  );
  const onCreate = useCallback(() => setEditInfo({}), []);

  useEffect(() => {
    if (!coursesError && !departmentsError) return;

    Alert.alert(
      intl.formatMessage(translations.error),
      intl.formatMessage(translations.errorDescription)
    );
    console.error(coursesError?.message ?? departmentsError?.message);
  }, [coursesError, departmentsError, intl]);

  return {
    courses,
    editInfo,
    departments,
    loading: coursesLoading || departmentsLoading,
    onDelete,
    onEdit,
    onCreate,
    onSave,
    onClose,
  };
};
