import { createContext, useContext } from 'react'
import { Locale } from '~/enums/Locale'

type LocaleContextProps = {
    locale: Locale
    setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<LocaleContextProps>({
    locale: Locale.DE,
    setLocale: () => {
        throw new Error('useLocale must be used within the LocaleProvider')
    },
})

export const useLocale = () => {
    const context = useContext(LocaleContext)

    if (!context) throw new Error('useLocale must be used within the LocaleProvider')

    return context
}
