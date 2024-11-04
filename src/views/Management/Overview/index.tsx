import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView, StyleSheet, View } from 'react-native'
import Header from '~/components/Header'
import { Page } from '~/enums/Page'
import { translations } from '~/translations/translations'
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
            <Header />
            <ScrollView contentContainerStyle={styles.content}>
                <ListSection title={intl.formatMessage(translations.entities)}>
                    <ListItem
                        title={intl.formatMessage(translations.courses)}
                        onPress={navigateTo(Page.CourseManagement)}
                        icon='account-group'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.lectures)}
                        onPress={navigateTo(Page.LectureManagement)}
                        icon='calendar-month'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.forms)}
                        onPress={navigateTo(Page.FormsManagement)}
                        icon='text-box-multiple-outline'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.ratings)}
                        onPress={navigateTo(Page.RatingManagement)}
                        icon='star-circle'
                    />
                </ListSection>
                <ListSection title={intl.formatMessage(translations.users)}>
                    <ListItem
                        title={intl.formatMessage(translations.students)}
                        onPress={navigateTo(Page.StudentManagement)}
                        icon='account'
                    />
                    <ListItem
                        title={intl.formatMessage(translations.lecturers)}
                        onPress={navigateTo(Page.LecturerManagement)}
                        icon='account-tie'
                    />
                </ListSection>
            </ScrollView>
        </View>
    )
}
export default ManagementOverview
