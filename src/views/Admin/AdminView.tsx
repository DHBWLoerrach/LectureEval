import React from 'react'
import { Button, ImageBackground, ScrollView, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { adminStyles } from './styles'

const AdminView = ({ navigation }: any) => {
    return (
        <ScrollView>
            {/* Header mit Bild und Avatar */}
            <View>
                <ImageBackground
                    style={adminStyles.image}
                    source={HeaderImage}
                    resizeMode='cover'
                >
                    <View style={adminStyles.overlay} />
                    <Text style={adminStyles.headerText}>Verwaltung</Text>
                </ImageBackground>
                <Button
                    title='Test'
                    onPress={() => navigation.navigate('Vorlesung bewerten')}
                ></Button>
            </View>
        </ScrollView>
    )
}

export default AdminView
