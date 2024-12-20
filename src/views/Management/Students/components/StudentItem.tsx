import { StyleSheet, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { globalStyles } from '~/styles/globalStyles'
import { Student } from '~/types/Student'

const styles = StyleSheet.create({
    text: {
        width: '100%',
    },
})

type Props = {
    student: Student
}

const StudentItem = ({ student }: Props) => {
    return (
        <Card
            style={globalStyles.card}
            mode='contained'
        >
            <View style={styles.text}>
                <Text
                    style={globalStyles.title}
                    numberOfLines={1}
                >
                    {student.firstName} {student.lastName}
                </Text>
            </View>
        </Card>
    )
}
export default StudentItem
