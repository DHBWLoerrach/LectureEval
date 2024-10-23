import { useCallback, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modal, Portal, Text, TextInput } from 'react-native-paper'
import { colors } from '~/styles/colors'

const styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 20,
    },
    option: {
        fontSize: 18,
        padding: 10,
    },
})

type Props = {
    label: string
    value: string | undefined
    error?: boolean
    options: string[]
    onChange: (value: string) => void
}

const SelectMenu = ({ label, error, value, options, onChange }: Props) => {
    const [visible, setVisible] = useState(false)

    const openModal = useCallback(() => setVisible(true), [setVisible])
    const closeModal = useCallback(() => setVisible(false), [setVisible])

    const handleSelect = useCallback(
        (item: string) => {
            onChange(item)
            closeModal()
        },
        [closeModal, onChange],
    )

    return (
        <View>
            <TextInput
                label={label}
                value={value}
                mode='outlined'
                error={error}
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
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={styles.modal}
                >
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)}>
                                <Text style={styles.option}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>
            </Portal>
        </View>
    )
}

export default SelectMenu
