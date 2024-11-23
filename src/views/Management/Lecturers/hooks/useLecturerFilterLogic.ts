import { useDeferredValue, useMemo, useState } from 'react'
import { Lecturer } from '~/types/Lecturer'

type Props = {
    lecturers: Lecturer[]
}

export const useLecturerFilterLogic = ({ lecturers }: Props) => {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDeferredValue(search)

    const filteredLecturers = useMemo(() => {
        return lecturers?.filter((lecturer) => {
            return (
                lecturer.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                lecturer.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                `${lecturer.firstName} ${lecturer.lastName}`
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
            )
        })
    }, [lecturers, debouncedSearch])

    return {
        search,
        setSearch,
        filteredLecturers,
    }
}
