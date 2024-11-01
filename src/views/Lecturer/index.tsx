import React from 'react'
import { useIntl } from 'react-intl'
import { ImageBackground, ScrollView, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { translations } from '~/translations/translations'
import { lecturerStyles } from './styles'

const LecturerView = () => {
    const intl = useIntl()

    return (
        <ScrollView>
            <View>
                <ImageBackground
                    style={lecturerStyles.image}
                    source={HeaderImage}
                    resizeMode='cover'
                >
                    <View style={lecturerStyles.overlay} />
                    <Text style={lecturerStyles.headerText}>
                        {intl.formatMessage(translations.results)}
                    </Text>
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

export default LecturerView
