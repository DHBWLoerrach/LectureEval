import { useIntl } from 'react-intl'
import { ImageBackground, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'
import HeaderImage from '~/../assets/header.png'
import { translations } from '~/translations/translations'
import { studentStyles } from './styles'

const StudentView = () => {
    const intl = useIntl()

    return (
        <ScrollView>
            <View>
                <ImageBackground
                    style={studentStyles.image}
                    source={HeaderImage}
                    resizeMode='cover'
                >
                    <View style={studentStyles.overlay} />
                    <Text style={studentStyles.headerText}>
                        {intl.formatMessage(translations.students)}
                    </Text>
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

export default StudentView
