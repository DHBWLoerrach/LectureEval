import { useDeferredValue, useMemo, useState } from 'react'
import { Lecture } from '~/types/Lecture'

type Props = {
    lectures: Lecture[]
}

export const useLectureFilterLogic = ({ lectures }: Props) => {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDeferredValue(search)

    const filteredLectures = useMemo(() => {
        return lectures?.filter((lecture) => {
            return lecture.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        })
    }, [lectures, debouncedSearch])

    return {
        search,
        setSearch,
        filteredLectures,
    }
}
