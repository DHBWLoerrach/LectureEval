import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, StyleSheet, View } from 'react-native'
import { List, Searchbar, SegmentedButtons, Text } from 'react-native-paper'
import Header from '~/components/Header'
import LoadingSpinner from '~/components/LoadingSpinner'
import { LectureType } from '~/enums/LectureType'
import { useQueryOnFocus } from '~/hooks/useQueryOnFocus'
import { globalStyles } from '~/styles/globalStyles'
import { theme } from '~/styles/theme'
import { translations } from '~/translations/translations'
import { Lecture } from '~/types/Lecture'
import { useLecturesLogic } from '~/views/Lectures/hooks/useLecturesLogic'

const styles = StyleSheet.create({
    listSection: {
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
})

const LecturesView = () => {
    useQueryOnFocus()

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
        ratingAverages,
        difficultyAverages,
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
                        ratingAverages[lecture.id] !== undefined
                            ? `${ratingAverages[lecture.id]} ${intl.formatMessage(translations.stars)}`
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
                            difficultyAverages[lecture.id] !== null
                                ? `${difficultyAverages[lecture.id]}/3`
                                : intl.formatMessage(translations.notSet)
                        }`}
                    />
                </List.Accordion>
            </View>
        ),
        [intl, ratingAverages, departmentMap, semesterMap, difficultyAverages],
    )

    if (isLoading) return <LoadingSpinner />

    return (
        <View style={globalStyles.flexBox}>
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
            {searchedLectures.length === 0 ? (
                <View style={globalStyles.noDataContainer}>
                    <Text style={globalStyles.noDataText}>
                        {intl.formatMessage(translations.noData)}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={searchedLectures}
                    keyExtractor={(lecture) => lecture.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={
                        showButton ? globalStyles.listSection : styles.listSection
                    }
                />
            )}
        </View>
    )
}

export default LecturesView
