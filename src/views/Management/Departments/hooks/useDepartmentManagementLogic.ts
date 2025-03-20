import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useAuth } from '~/context/AuthContext';
import { useDialog } from '~/context/DialogContext';
import { useSnackbar } from '~/context/SnackbarContext';
import { useDeleteDepartmentMutation } from '~/queries/Departments/useDeleteDepartmentMutation';
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery';
import { useUpsertDepartmentMutation } from '~/queries/Departments/useUpsertDepartmentMutation';
import { useUserLocationsQuery } from '~/queries/UserLocations/useUserLocationsQuery';
import { translations } from '~/translations/translations';
import { Department } from '~/types/Department';
import { DepartmentFormData } from '~/views/Management/Departments/types/DepartmentFormData';

export const useDepartmentManagementLogic = () => {
  const intl = useIntl();
  const { session } = useAuth();

  const showDialog = useDialog();
  const showSnackbar = useSnackbar();

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
    refetch: refetchDepartments,
  } = useDepartmentsQuery();

  const { mutate: saveDepartment } = useUpsertDepartmentMutation();
  const { mutate: deleteDepartment } = useDeleteDepartmentMutation();

  const {
    data: userLocation,
    isLoading: userLocationLoading,
    error: userLocationError,
  } = useUserLocationsQuery({
    userId: session?.user.id,
  });

  const [editInfo, setEditInfo] = useState<{ initialData?: Department }>();

  const onSave = useCallback(
    (department: DepartmentFormData) => {
      saveDepartment(department, {
        onSuccess: () => {
          refetchDepartments();
          setEditInfo(undefined);
          showSnackbar({
            text: department.id
              ? intl.formatMessage(translations.changesSaved)
              : intl.formatMessage(translations.entityCreated, {
                  article: intl.formatMessage(translations.neutralArticle),
                  entity: intl.formatMessage(translations.department),
                }),
          });
        },
        onError: (error) => {
          Alert.alert(
            intl.formatMessage(translations.error),
            intl.formatMessage(translations.errorDescription)
          );
          console.error(
            `Unexpected error while saving a form: ${error.message}`
          );
        },
      });
    },
    [saveDepartment, refetchDepartments, showSnackbar, intl]
  );

  const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo]);

  const onEdit = useCallback(
    (department: Department) => setEditInfo({ initialData: department }),
    []
  );
  const onCreate = useCallback(() => setEditInfo({}), []);

  const onDelete = useCallback(
    (department: Department) => {
      showDialog({
        title: intl.formatMessage(translations.deleteEntityHeader, {
          entity: intl.formatMessage(translations.department),
        }),
        description: intl.formatMessage(translations.deleteEntityDescription, {
          name: department.name,
        }),
        onAccept: () =>
          deleteDepartment(department.id, {
            onSuccess: () => {
              refetchDepartments();
              showSnackbar({
                text: intl.formatMessage(translations.entityDeleted, {
                  article: intl.formatMessage(translations.neutralArticle),
                  entity: intl.formatMessage(translations.department),
                }),
              });
            },
            onError: (error) => {
              Alert.alert(
                intl.formatMessage(translations.error),
                intl.formatMessage(translations.errorDescription)
              );
              console.error(
                `Unexpected error while deleting a form: ${error.message}`
              );
            },
          }),
      });
    },
    [showDialog, intl, deleteDepartment, refetchDepartments, showSnackbar]
  );

  const loading = useMemo(
    () => departmentsLoading || userLocationLoading,
    [departmentsLoading, userLocationLoading]
  );

  const error = useMemo(
    () => departmentsError || userLocationError,
    [departmentsError, userLocationError]
  );

  useEffect(() => {
    if (!error) return;

    Alert.alert(
      intl.formatMessage(translations.error),
      intl.formatMessage(translations.errorDescription)
    );

    console.error(error.message);
  }, [error, intl]);

  return {
    loading,
    onEdit,
    onSave,
    onClose,
    onDelete,
    onCreate,
    editInfo,
    departments,
    userLocation,
  };
};
