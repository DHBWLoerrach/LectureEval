import { useCallback, useMemo, useState } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { FlatList, StyleSheet, View } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { HelperText, Modal, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { colors } from '~/styles/colors'

const styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 20,
    },
    option: {
        fontSize: RFValue(14),
        padding: 10,
    },
})

type SelectOption = {
    label: string
    value: number
}

type Props = {
    name: string
    label: string
    options: SelectOption[]
    helperText?: string
    rules?: UseControllerProps['rules']
}

const SelectMenu = ({ name, rules, helperText, label, options }: Props) => {
    const [visible, setVisible] = useState(false)

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name, rules })

    const openModal = useCallback(() => setVisible(true), [setVisible])
    const closeModal = useCallback(() => setVisible(false), [setVisible])

    const handleSelect = useCallback(
        (value: number) => {
            onChange(value)
            closeModal()
        },
        [closeModal, onChange],
    )

    const displayValue = useMemo(
        () => options.find((o) => o.value === value)?.label,
        [options, value],
    )

    return (
        <View>
            <TextInput
                label={label}
                value={displayValue}
                mode='outlined'
                error={!!error}
                onFocus={(e) => {
                    openModal()
                    e.target.blur()
                }}
                showSoftInputOnFocus={false}
                right={
                    <TextInput.Icon
                        icon='menu-down'
                        onPress={openModal}
                    />
                }
            />
            {(helperText || error) && (
                <HelperText
                    visible
                    type={error ? 'error' : 'info'}
                    padding='none'
                >
                    {error?.message ?? helperText}
                </HelperText>
            )}
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={styles.modal}
                >
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <TouchableRipple
                                key={item.value.toString()}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text style={styles.option}>{item.label}</Text>
                            </TouchableRipple>
                        )}
                    />
                </Modal>
            </Portal>
        </View>
    )
}

export default SelectMenu
