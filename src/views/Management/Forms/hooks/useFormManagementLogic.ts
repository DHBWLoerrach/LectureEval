import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert } from 'react-native';
import { useDialog } from '~/context/DialogContext';
import { useSnackbar } from '~/context/SnackbarContext';
import { Route } from '~/enums/Route';
import { useDepartmentsQuery } from '~/queries/Departments/useDepartmentsQuery';
import { useDeleteFormMutation } from '~/queries/Forms/useDeleteFormMutation';
import { useFormsQuery } from '~/queries/Forms/useFormsQuery';
import { useUpsertFormMutation } from '~/queries/Forms/useUpsertFormMutation';
import { translations } from '~/translations/translations';
import { Form } from '~/types/Form';
import { FormFormData } from '~/views/Management/Forms/types/FormFormData';

export const useFormManagementLogic = () => {
  const intl = useIntl();

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const showDialog = useDialog();
  const showSnackbar = useSnackbar();

  const [editInfo, setEditInfo] = useState<{ initialData?: Form }>();

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartmentsQuery();

  const {
    data: forms,
    isLoading: formsLoading,
    error: formsError,
    refetch: refetchForms,
  } = useFormsQuery();

  const { mutate: saveForm } = useUpsertFormMutation();
  const { mutate: deleteForm } = useDeleteFormMutation();

  const onSave = useCallback(
    (form: FormFormData) => {
      saveForm(form, {
        onSuccess: () => {
          refetchForms();
          setEditInfo(undefined);
          showSnackbar({
            text: form.id
              ? intl.formatMessage(translations.changesSaved)
              : intl.formatMessage(translations.entityCreated, {
                  article: intl.formatMessage(translations.neutralArticle),
                  entity: intl.formatMessage(translations.form),
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
    [saveForm, refetchForms, showSnackbar, intl]
  );

  const onClose = useCallback(() => setEditInfo(undefined), [setEditInfo]);

  const onDelete = useCallback(
    (form: Form) => {
      showDialog({
        title: intl.formatMessage(translations.deleteEntityHeader, {
          entity: intl.formatMessage(translations.form),
        }),
        description: intl.formatMessage(translations.deleteEntityDescription, {
          name: form.name,
        }),
        onAccept: () =>
          deleteForm(form.id, {
            onSuccess: () => {
              refetchForms();
              showSnackbar({
                text: intl.formatMessage(translations.entityDeleted, {
                  article: intl.formatMessage(translations.neutralArticle),
                  entity: intl.formatMessage(translations.form),
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
    [showDialog, deleteForm, refetchForms, showSnackbar, intl]
  );

  const onEdit = useCallback(
    (form: Form) => setEditInfo({ initialData: form }),
    []
  );
  const onCreate = useCallback(() => setEditInfo({}), []);
  const onDesign = useCallback(
    (form: Form) => {
      navigation.navigate(Route.FormDesigner, {
        formId: form.id,
        departmentId: form.departmentID,
      });
    },
    [navigation]
  );

  useEffect(() => {
    if (!formsError && !departmentsError) return;

    Alert.alert(
      intl.formatMessage(translations.error),
      intl.formatMessage(translations.errorDescription)
    );
    console.error(formsError?.message ?? departmentsError?.message);
  }, [formsError, departmentsError, intl]);

  return {
    forms,
    editInfo,
    departments,
    loading: formsLoading || departmentsLoading,
    onDelete,
    onEdit,
    onCreate,
    onSave,
    onClose,
    onDesign,
  };
};
