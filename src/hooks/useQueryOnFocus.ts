import { useFocusEffect } from '@react-navigation/native'
import { focusManager } from '@tanstack/react-query'
import { useCallback } from 'react'

/**
 * React-Query normally relies on the window focus event to pause and resume queries.
 * This hook allows us to use the React Navigation focus event to pause and resume queries.
 * Therefore we need to use this query **inside** a navigation container and for every screen which should trigger a refocus event.
 */
export const useQueryOnFocus = () => {
    useFocusEffect(
        useCallback(() => {
            focusManager.setFocused(true)

            return () => focusManager.setFocused(false)
        }, []),
    )
}
