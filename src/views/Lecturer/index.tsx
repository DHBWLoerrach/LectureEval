import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, View } from 'react-native'
import { List, Searchbar } from 'react-native-paper'
import Header from '~/components/Header'
import LoadingSpinner from '~/components/LoadingSpinner'
import { globalStyles } from '~/styles/globalStyles'
import { translations } from '~/translations/translations'
import { CourseAssignment } from '~/types/CourseAssignment'
import { Lecture } from '~/types/Lecture'
import CourseItem from '~/views/Lecturer/components/CourseItem'
import { useLecturerLogic } from '~/views/Lecturer/hooks/useLecturerLogic'
import styles from '~/views/Lecturer/styles'

const LecturerView = () => {
    const {
        search,
        setSearch,
        searchedLectures,
        courseAssignments,
        ratingAverages,
        difficultyAverages,
        isLoading,
        departmentMap,
        semesterMap,
        courseMap,
    } = useLecturerLogic()

    const intl = useIntl()

    const renderCourseItem = useCallback(
        ({ item: courseAssignment }: { item: CourseAssignment }) => (
            <CourseItem
                courseAssignment={courseAssignment}
                courseMap={courseMap}
                ratingAverages={ratingAverages}
                difficultyAverages={difficultyAverages}
            />
        ),
        [courseMap, ratingAverages, difficultyAverages],
    )

    const renderItem = useCallback(
        ({ item: lecture }: { item: Lecture }) => (
            <View style={globalStyles.listAccordionWrapper}>
                <List.Accordion
                    title={lecture.name}
                    titleStyle={globalStyles.listAccordionTitle}
                    style={globalStyles.listAccordion}
                    description={`${intl.formatMessage(translations.rating)}: ${
                        lecture.rating !== null
                            ? `${lecture.rating} ${intl.formatMessage(translations.stars)}`
                            : intl.formatMessage(translations.notSet)
                    }`}
                >
                    <List.Item
                        title={
                            departmentMap[lecture.departmentID] ??
                            intl.formatMessage(translations.notSet)
                        }
                        description={
                            semesterMap[lecture.semesterID] ??
                            intl.formatMessage(translations.notSet)
                        }
                    />
                    <FlatList
                        data={courseAssignments}
                        keyExtractor={(courseAssignment) => courseAssignment.id.toString()}
                        renderItem={renderCourseItem}
                        contentContainerStyle={styles.listSection}
                    />
                </List.Accordion>
            </View>
        ),
        [departmentMap, semesterMap, courseAssignments, renderCourseItem, intl],
    )

    if (isLoading) return <LoadingSpinner />

    return (
        <View>
            <Header />
            <View>
                <Searchbar
                    style={globalStyles.searchbar}
                    value={search}
                    onChangeText={setSearch}
                    placeholder={intl.formatMessage(translations.search)}
                />
            </View>
            <FlatList
                data={searchedLectures}
                keyExtractor={(lecture) => lecture.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listSection}
            />
        </View>
    )
}

export default LecturerView
