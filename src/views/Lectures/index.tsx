import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, StyleSheet, View } from 'react-native'
import { List, Searchbar, SegmentedButtons } from 'react-native-paper'
import Header from '~/components/Header'
import LoadingSpinner from '~/components/LoadingSpinner'
import { LectureType } from '~/enums/LectureType'
import { globalStyles } from '~/styles/globalStyles'
import { theme } from '~/styles/theme'
import { translations } from '~/translations/translations'
import { Lecture } from '~/types/Lecture'
import { useLecturesLogic } from '~/views/Lectures/hooks/useLecturesLogic'

const styles = StyleSheet.create({
    listSection: {
        paddingBottom: 260,
        paddingHorizontal: 20,
    },
})

const LecturesView = () => {
    const {
        lectureView,
        setLectureView,
        showButton,
        buttons,
        search,
        setSearch,
        searchedLectures,
        isLoading,
        departmentMap,
        semesterMap,
    } = useLecturesLogic()

    const intl = useIntl()

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
                    <List.Item
                        title={`${intl.formatMessage(translations.difficulty)}: ${
                            lecture.difficulty !== null
                                ? `${lecture.difficulty}/3`
                                : intl.formatMessage(translations.notSet)
                        }`}
                    />
                </List.Accordion>
            </View>
        ),
        [departmentMap, semesterMap, intl],
    )

    if (isLoading) return <LoadingSpinner />

    return (
        <View>
            <Header />
            <View>
                {showButton && (
                    <SegmentedButtons
                        value={lectureView}
                        onValueChange={(value) => setLectureView(value as LectureType)}
                        buttons={buttons}
                        style={globalStyles.segmentedButtons}
                        theme={theme}
                    />
                )}
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
                contentContainerStyle={showButton ? globalStyles.listSection : styles.listSection}
            />
        </View>
    )
}

export default LecturesView
