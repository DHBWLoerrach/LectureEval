import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback } from 'react'
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { Page } from '~/enums/Page'
import { loginStyles } from '~/views/Login/styles'
import ListItem from '~/views/Management/Overview/components/ListItem'
import ListSection from '~/views/Management/Overview/components/ListSection'

const styles = StyleSheet.create({
    content: {
        flex: 1,
        gap: 30,
        padding: 20,
    },
    flexBox: {
        flex: 1,
    },
})

const ManagementOverview = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    const navigateTo = useCallback(
        (page: Page) => {
            return () => navigation.navigate(page)
        },
        [navigation],
    )

    return (
        <View style={styles.flexBox}>
            {/* TODO: Replace with Header component */}
            <ImageBackground
                style={loginStyles.header}
                source={HeaderImage}
            >
                <View style={loginStyles.overlay} />
                <Text style={loginStyles.headerText}>Verwaltung</Text>
            </ImageBackground>
            <ScrollView contentContainerStyle={styles.content}>
                <ListSection title='Entitäten'>
                    <ListItem
                        title='Kurse'
                        onPress={navigateTo(Page.CourseManagement)}
                        icon='account-group'
                    />
                    <ListItem
                        title='Vorlesungen'
                        onPress={navigateTo(Page.LectureManagement)}
                        icon='calendar-month'
                    />
                    <ListItem
                        title='Formulare'
                        onPress={navigateTo(Page.FormsManagement)}
                        icon='text-box-multiple-outline'
                    />
                    <ListItem
                        title='Bewertungen'
                        onPress={navigateTo(Page.RatingManagement)}
                        icon='star-circle'
                    />
                </ListSection>
                <ListSection title='Benutzer*innen'>
                    <ListItem
                        title='Studierende'
                        onPress={navigateTo(Page.StudentManagement)}
                        icon='account'
                    />
                    <ListItem
                        title='Dozierende'
                        onPress={navigateTo(Page.LecturerManagement)}
                        icon='account-tie'
                    />
                </ListSection>
            </ScrollView>
        </View>
    )
}
export default ManagementOverview
