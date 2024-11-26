import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Table } from '~/enums/Table'
import { supabase } from '~/services/supabase'
import { LectureFormData } from '~/views/Management/Lectures/types/LectureFormData'

export const useUpsertLectureMutation = () => {
    const mutationFn = useCallback(async (lecture: LectureFormData) => {
        await supabase.from(Table.Lectures).upsert(lecture).throwOnError()
    }, [])

    return useMutation({
        mutationFn,
    })
}
