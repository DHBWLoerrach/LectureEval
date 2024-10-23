import React from 'react'
import { ImageBackground, ScrollView, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { studentStyles } from './styles'

const StudentView = () => {
    return (
        <ScrollView>
            {/* Header mit Bild und Avatar */}
            <View>
                <ImageBackground
                    style={studentStyles.image}
                    source={HeaderImage}
                    resizeMode='cover'
                >
                    <View style={studentStyles.overlay} />
                    <Text style={studentStyles.headerText}>Vorlesungen</Text>
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

export default StudentView
