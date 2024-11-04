import { useCallback, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, IconButton, Modal, Portal, Text } from 'react-native-paper'
import { colors } from '~/styles/colors'
import { theme } from '~/styles/theme'

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        height: 50,
        padding: 10,
        width: 50,
    },
    modal: {
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingHorizontal: 20,
        padding: 20,
    },
    optionText: {
        fontSize: 18,
        lineHeight: 25,
        paddingLeft: 20,
    },
    options: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
})

type Props = {
    icon: string
    options: { label: string; iconSource: string }[]
    onChange: (selectedOption: string) => void
    children?: React.ReactNode
}

const SelectButton = ({ icon, options, onChange, children }: Props) => {
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
            <IconButton
                icon={icon}
                mode='contained'
                onPress={(e) => {
                    openModal()
                    e.target.blur()
                }}
                style={styles.button}
                theme={theme}
            />
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={styles.modal}
                >
                    <View style={styles.options}>{children}</View>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.label}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelect(item.label)}
                                style={styles.options}
                            >
                                <Icon
                                    source={item.iconSource}
                                    size={30}
                                    theme={theme}
                                />
                                <Text style={styles.optionText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>
            </Portal>
        </View>
    )
}

export default SelectButton
