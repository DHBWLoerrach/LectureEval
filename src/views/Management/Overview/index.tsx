import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import HeaderImage from '~/../assets/header.png'
import { Page } from '~/enums/Page'
import { translations } from '~/translations/translations'
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
    const intl = useIntl()

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
                <Text style={loginStyles.headerText}>
                    {intl.formatMessage(translations.managementLabel)}
                </Text>
            </ImageBackground>
            <ScrollView contentContainerStyle={styles.content}>
                <ListSection title={intl.formatMessage(translations.entitiesLabel)}>
                    <ListItem
                        title={intl.formatMessage(translations.coursesLabel)}
                        onPress={navigateTo(Page.CourseManagement)}
                        icon='account-group'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.lecturesLabel)}
                        onPress={navigateTo(Page.LectureManagement)}
                        icon='calendar-month'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.formsLabel)}
                        onPress={navigateTo(Page.FormsManagement)}
                        icon='text-box-multiple-outline'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.ratingsLabel)}
                        onPress={navigateTo(Page.RatingManagement)}
                        icon='star-circle'
                    />
                </ListSection>
                <ListSection title={intl.formatMessage(translations.usersLabel)}>
                    <ListItem
                        title={intl.formatMessage(translations.studentsLabel)}
                        onPress={navigateTo(Page.StudentManagement)}
                        icon='account'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.lecturersLabel)}
                        onPress={navigateTo(Page.LecturerManagement)}
                        icon='account-tie'
                    />
                </ListSection>
            </ScrollView>
        </View>
    )
}
export default ManagementOverview
