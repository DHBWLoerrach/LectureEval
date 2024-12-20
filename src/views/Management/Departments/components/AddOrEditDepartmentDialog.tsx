import { useCallback, useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { StyleSheet } from 'react-native'
import { Dialog, Portal } from 'react-native-paper'
import Button from '~/components/Button'
import SelectMenu from '~/components/SelectMenu'
import TextInput from '~/components/TextInput'
import { useLocale } from '~/context/LocaleContext'
import { useLocationsQuery } from '~/queries/Locations/useLocationsQuery'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { Department } from '~/types/Department'
import { UserLocation } from '~/types/UserLocation'
import { DepartmentFormData } from '~/views/Management/Departments/types/DepartmentFormData'

type Props = {
    location: UserLocation
    departments: Department[] | undefined
    onSave: (departmentData: DepartmentFormData) => void
    onClose: () => void
    initialData?: Department
}

const styles = StyleSheet.create({
    content: { gap: 10 },
})

const AddOrEditDepartmentDialog = ({
    location,
    departments,
    onClose,
    onSave,
    initialData,
}: Props) => {
    const intl = useIntl()
    const { locale } = useLocale()

    const { data: locations } = useLocationsQuery()

    const form = useForm<DepartmentFormData>({
        defaultValues: {
            ...initialData,
            locationId: location.locationId,
        },
    })
    const {
        trigger,
        handleSubmit,
        formState: { isDirty },
    } = form

    useEffect(() => {
        if (!isDirty) return

        trigger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale])

    const title = useMemo(
        () =>
            initialData
                ? intl.formatMessage(translations.editEntityHeader, {
                      entity: intl.formatMessage(translations.department),
                  })
                : intl.formatMessage(translations.createEntityHeader, {
                      entity: intl.formatMessage(translations.department),
                  }),
        [initialData, intl],
    )

    const validateName = useCallback(
        (name: string) => {
            const nameTaken = departments?.reduce((exists, department) => {
                if (department.name.toLowerCase().localeCompare(name.toLowerCase()) !== 0)
                    return exists

                // The form itself should be allowed to have its name
                if (department.id === initialData?.id) return exists

                return true
            }, false)

            if (!nameTaken) return

            return intl.formatMessage(translations.formNameExists)
        },
        [departments, initialData?.id, intl],
    )

    const options = useMemo(
        () =>
            locations?.map((loc) => ({
                label: loc.name,
                value: loc.id,
            })) ?? [],
        [locations],
    )

    return (
        <Portal>
            <Dialog
                visible
                onDismiss={onClose}
                style={globalStyles.dialog}
            >
                <FormProvider {...form}>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Content style={styles.content}>
                        <TextInput
                            name='name'
                            label={intl.formatMessage(translations.name)}
                            rules={{
                                required: intl.formatMessage(translations.required),
                                validate: validateName,
                            }}
                        />
                        <SelectMenu
                            disabled
                            name='locationId'
                            label={intl.formatMessage(translations.location)}
                            options={options}
                            rules={{ required: intl.formatMessage(translations.required) }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={onClose}>{intl.formatMessage(translations.cancel)}</Button>
                        <Button
                            disabled={!isDirty}
                            onPress={handleSubmit(onSave)}
                        >
                            {intl.formatMessage(translations.save)}
                        </Button>
                    </Dialog.Actions>
                </FormProvider>
            </Dialog>
        </Portal>
    )
}

export default AddOrEditDepartmentDialog
