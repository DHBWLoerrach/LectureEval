import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import Button from '~/components/Button';
import SelectMenu from '~/components/SelectMenu';
import TextInput from '~/components/TextInput';
import { useLocale } from '~/context/LocaleContext';
import { globalStyles } from '~/styles/globalStyles';
import { translations } from '~/translations/translations';
import { Department } from '~/types/Department';
import { Lecture } from '~/types/Lecture';
import { Semester } from '~/types/Semester';
import { LectureFormData } from '~/views/Management/Lectures/types/LectureFormData';

type Props = {
  lectures: Lecture[] | undefined;
  onSave: (formData: LectureFormData) => void;
  onClose: () => void;
  initialData?: Lecture;
  departments: Department[];
  semesters: Semester[];
};

const styles = StyleSheet.create({
  content: { gap: 10 },
});

const AddOrEditLectureDialog = ({
  lectures,
  onClose,
  onSave,
  initialData,
  departments,
  semesters,
}: Props) => {
  const intl = useIntl();
  const { locale } = useLocale();

  const form = useForm<LectureFormData>({
    defaultValues: initialData,
  });
  const {
    watch,
    trigger,
    handleSubmit,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (!isDirty) return;

    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const title = useMemo(
    () =>
      initialData
        ? intl.formatMessage(translations.editEntityHeader, {
            entity: intl.formatMessage(translations.lecture),
          })
        : intl.formatMessage(translations.createEntityHeader, {
            entity: intl.formatMessage(translations.lecture),
          }),
    [initialData, intl]
  );

  const departmentOptions = useMemo(() => {
    return (
      departments?.map((dep) => ({
        label: dep.name,
        value: dep.id,
      })) ?? []
    );
  }, [departments]);

  const semesterOptions = useMemo(() => {
    return (
      semesters?.map((sem) => ({
        label: sem.name,
        value: sem.id,
      })) ?? []
    );
  }, [semesters]);

  const validateName = useCallback(
    (name: string) => {
      const departmentID = watch('departmentID');
      const semesterID = watch('semesterID');

      const nameTaken = lectures?.reduce((exists, lecture) => {
        if (lecture.name.toLowerCase().localeCompare(name.toLowerCase()) !== 0)
          return exists;

        // The lecture itself should be allowed to have its name
        if (lecture.name === initialData?.name) return exists;

        // Lectures may have the same name if they are in different departments
        if (lecture.departmentID !== departmentID) return exists;

        // Lectures may have the same name if they are in different semesters
        if (lecture.semesterID !== semesterID) return exists;

        return true;
      }, false);

      if (!nameTaken) return;

      return intl.formatMessage(translations.lectureNameExists);
    },
    [watch, lectures, intl, initialData?.name]
  );

  return (
    <Portal>
      <Dialog visible onDismiss={onClose} style={globalStyles.dialog}>
        <FormProvider {...form}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content style={styles.content}>
            <TextInput
              name="name"
              label={intl.formatMessage(translations.name)}
              rules={{
                required: intl.formatMessage(translations.required),
                validate: validateName,
              }}
            />
            <SelectMenu
              name="departmentID"
              label={intl.formatMessage(translations.department)}
              options={departmentOptions}
              rules={{ required: intl.formatMessage(translations.required) }}
            />
            <SelectMenu
              name="semesterID"
              label={intl.formatMessage(translations.semester)}
              options={semesterOptions}
              rules={{ required: intl.formatMessage(translations.required) }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClose}>
              {intl.formatMessage(translations.cancel)}
            </Button>
            <Button disabled={!isDirty} onPress={handleSubmit(onSave)}>
              {intl.formatMessage(translations.save)}
            </Button>
          </Dialog.Actions>
        </FormProvider>
      </Dialog>
    </Portal>
  );
};

export default AddOrEditLectureDialog;
