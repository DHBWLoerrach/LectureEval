import React from 'react'
import { ImageBackground, ScrollView, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { lecturerStyles } from './styles'

const LecturerView = () => {
    return (
        <ScrollView>
            {/* Header mit Bild und Avatar */}
            <View>
                <ImageBackground
                    style={lecturerStyles.image}
                    source={HeaderImage}
                    resizeMode='cover'
                >
                    <View style={lecturerStyles.overlay} />
                    <Text style={lecturerStyles.headerText}>Auswertung</Text>
                </ImageBackground>
            </View>
        </ScrollView>
    )
}

export default LecturerView
