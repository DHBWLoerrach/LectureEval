import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { FlatList, ListRenderItem, StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { useLecturersQuery } from '~/queries/Lecturers/useLecturersQuery'
import { colors } from '~/styles/colors'
import { translations } from '~/translations/translations'
import { Lecturer } from '~/types/Lecturer'
import ManagementWrapper from '~/views/Management/components/ManagementWrapper'
import LecturerItem from '~/views/Management/Lecturers/components/LecturerItem'
import { useLecturerFilterLogic } from '~/views/Management/Lecturers/hooks/useLecturerFilterLogic'

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingTop: 10,
    },
    search: {
        backgroundColor: colors.tertiary,
        margin: 20,
        marginBottom: 10,
    },
})

const LecturersManagement = () => {
    const intl = useIntl()

    const { data: lecturers, isLoading: studentsLoading } = useLecturersQuery()

    const { filteredLecturers, search, setSearch } = useLecturerFilterLogic({
        lecturers: lecturers ?? [],
    })

    const renderGroup = useCallback<ListRenderItem<Lecturer>>(({ item }) => {
        return <LecturerItem lecturer={item} />
    }, [])

    return (
        <ManagementWrapper
            fab={false}
            loading={studentsLoading}
        >
            <Searchbar
                style={styles.search}
                value={search}
                onChangeText={setSearch}
                placeholder={intl.formatMessage(translations.search)}
            />
            <FlatList
                data={filteredLecturers}
                renderItem={renderGroup}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.content}
            />
        </ManagementWrapper>
    )
}

export default LecturersManagement
