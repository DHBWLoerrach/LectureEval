import { StyleSheet, View } from 'react-native'
import { Divider, List } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

const styles = StyleSheet.create({
    listItem: {
        paddingHorizontal: 20,
    },
})

type Props = {
    title: string
    icon: IconSource
    onPress: () => void
}

const ListItem = ({ icon, onPress, title }: Props) => {
    return (
        <View>
            <List.Item
                title={title}
                onPress={onPress}
                style={styles.listItem}
                left={() => <List.Icon icon={icon} />}
                right={() => <List.Icon icon='chevron-right' />}
            />
            <Divider />
        </View>
    )
}
export default ListItem
