import { useDeferredValue, useMemo, useState } from 'react'
import { Course } from '~/types/Course'

type Props = {
    courses: Course[]
}

export const useCourseFilterLogic = ({ courses }: Props) => {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDeferredValue(search)

    const filteredCourses = useMemo(() => {
        return courses?.filter((course) => {
            return course.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        })
    }, [courses, debouncedSearch])

    return {
        search,
        setSearch,
        filteredCourses,
    }
}
