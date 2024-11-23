import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Lecturer } from '~/types/Lecturer'

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        maxWidth: '100%',
    },
    title: {
        fontSize: RFValue(17),
        fontWeight: 'bold',
    },
})

type Props = {
    lecturer: Lecturer
}

const LecturerItem = ({ lecturer }: Props) => {
    return (
        <Card
            style={styles.card}
            contentStyle={styles.row}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >
                    {lecturer.firstName} {lecturer.lastName}
                </Text>
            </View>
        </Card>
    )
}
export default LecturerItem
