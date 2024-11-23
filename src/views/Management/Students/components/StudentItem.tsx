import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { RFValue } from 'react-native-responsive-fontsize'
import { Student } from '~/types/Student'

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    student: Student
}

const StudentItem = ({ student }: Props) => {
    return (
        <Card
            style={styles.card}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >
                    {student.firstName} {student.lastName}
                </Text>
            </View>
        </Card>
    )
}
export default StudentItem
