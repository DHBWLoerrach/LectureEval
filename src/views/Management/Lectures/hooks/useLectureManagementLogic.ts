import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useDialog } from '~/context/DialogContext';
import { useSnackbar } from '~/context/SnackbarContext';
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery';
import { useDeleteLectureMutation } from '~/queries/Lectures/useDeleteLectureMutation';
import { useLecturesQuery } from '~/queries/Lectures/useLecturesQuery';
import { useUpsertLectureMutation } from '~/queries/Lectures/useUpsertLectureMutation';
import { useSemestersQuery } from '~/queries/Semesters/useSemestersQuery';
import { translations } from '~/translations/translations';
import { Lecture } from '~/types/Lecture';
import { LectureFormData } from '~/views/Management/Lectures/types/LectureFormData';

export const useLectureManagementLogic = () => {
  const intl = useIntl();

  const showDialog = useDialog();
  const showSnackbar = useSnackbar();

  const [editInfo, setEditInfo] = useState<{ initialData?: Lecture }>();

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartmentsQuery();

  const {
    data: lectures,
    isLoading: lecturesLoading,
    error: lecturesError,
    refetch: refetchLectures,
  } = useLecturesQuery();

  const {
    data: semesters,
    isLoading: semestersLoading,
    error: semestersError,
  } = useSemestersQuery();

  const { mutate: saveLecture } = useUpsertLectureMutation();
  const { mutate: deleteLecture } = useDeleteLectureMutation();

  const onSave = useCallback(
    (lecture: LectureFormData) => {
      saveLecture(lecture, {
        onSuccess: () => {
          refetchLectures();
          setEditInfo(undefined);
          showSnackbar({
            text: lecture.name
              ? intl.formatMessage(translations.changesSaved)
              : intl.formatMessage(translations.entityCreated, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.lecture),
                }),
          });
        },
        onError: (error) => {
          Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription)
          );
          console.error(
            `Unexpected error while saving a lecture: ${error.message}`
          );
        },
      });
    },
    [saveLecture, refetchLectures, showSnackbar, intl]
  );

  const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo]);

  const onDelete = useCallback(
    (lecture: Lecture) => {
      showDialog({
        title: intl.formatMessage(translations.deleteEntityHeader, {
          entity: intl.formatMessage(translations.lecture),
        }),
        description: intl.formatMessage(translations.deleteEntityDescription, {
          name: lecture.name,
        }),
        onAccept: () =>
          deleteLecture(lecture.id, {
            onSuccess: () => {
              refetchLectures();
              showSnackbar({
                text: intl.formatMessage(translations.entityDeleted, {
                  article: intl.formatMessage(translations.femaleArticle),
                  entity: intl.formatMessage(translations.lecture),
                }),
              });
            },
            onError: (error) => {
              Alert.alert(
                intl.formatMessage(translations.error),
                intl.formatMessage(translations.errorDescription)
              );
              console.error(
                `Unexpected error while deleting a lecture: ${error.message}`
              );
            },
          }),
      });
    },
    [showDialog, deleteLecture, refetchLectures, showSnackbar, intl]
  );

  const onEdit = useCallback(
    (lecture: Lecture) => setEditInfo({ initialData: lecture }),
    []
  );
  const onCreate = useCallback(() => setEditInfo({}), []);

  useEffect(() => {
    if (!lecturesError && !departmentsError && !semestersError) return;

    Alert.alert(
      intl.formatMessage(translations.error),
      intl.formatMessage(translations.errorDescription)
    );
    console.error(
      lecturesError?.message ??
        departmentsError?.message ??
        semestersError?.message
    );
  }, [lecturesError, departmentsError, intl, semestersError]);

  return {
    lectures,
    editInfo,
    departments,
    semesters,
    loading: lecturesLoading || departmentsLoading || semestersLoading,
    onDelete,
    onEdit,
    onCreate,
    onSave,
    onClose,
  };
};
