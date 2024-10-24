import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Button, ImageBackground, ScrollView, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { Page } from '~/enums/Page'
import { adminStyles } from './styles'

const AdminView = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    return (
        <ScrollView>
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
                    onPress={() => navigation.navigate(Page.FormsView)}
                ></Button>
            </View>
        </ScrollView>
    )
}

export default AdminView
