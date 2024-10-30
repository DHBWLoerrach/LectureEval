import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { Divider, List } from 'react-native-paper'

const styles = StyleSheet.create({
    listSectionHeading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

type Props = PropsWithChildren<{
    title: string
}>

const ListSection = ({ title, children }: Props) => {
    return (
        <List.Section
            title={title}
            titleStyle={styles.listSectionHeading}
        >
            <Divider />
            {children}
        </List.Section>
    )
}

export default ListSection
