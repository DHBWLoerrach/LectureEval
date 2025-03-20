import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import Button from '~/components/Button';
import TextInput from '~/components/TextInput';
import { useLocale } from '~/context/LocaleContext';
import { globalStyles } from '~/styles/globalStyles';
import { translations } from '~/translations/translations';
import { StepFormData } from '~/views/Management/Designer/types/StepFormData';

export type StepEditInfo = {
  formId: number;
  serial: number;
  step?: StepFormData;
};
type Props = {
  editInfo: StepEditInfo;
  onClose: () => void;
  onSave: (formData: StepFormData) => void;
};

const styles = StyleSheet.create({
  content: { gap: 10 },
});

const AddOrEditStepDialog = ({ editInfo, onClose, onSave }: Props) => {
  const intl = useIntl();
  const { locale } = useLocale();

  const form = useForm<StepFormData>({
    defaultValues: {
      ...editInfo.step,
      formID: editInfo.formId,
      serial: editInfo.serial,
    },
  });
  const {
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
      editInfo.step
        ? intl.formatMessage(translations.editEntityHeader, {
            entity: intl.formatMessage(translations.stepLabel),
          })
        : intl.formatMessage(translations.createEntityHeader, {
            entity: intl.formatMessage(translations.stepLabel),
          }),
    [intl, editInfo.step]
  );

  return (
    <Portal>
      <Dialog visible onDismiss={onClose} style={globalStyles.dialog}>
        <FormProvider {...form}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content style={styles.content}>
            <TextInput
              name="title"
              label={intl.formatMessage(translations.titleLabel)}
              rules={{ required: intl.formatMessage(translations.required) }}
            />
            <TextInput
              name="subTitle"
              label={intl.formatMessage(translations.subTitleLabel)}
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

export default AddOrEditStepDialog;
