import { PropsWithChildren, useMemo, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { LocaleContext } from '~/context/LocaleContext'
import { Locale } from '~/enums/Locale'
import { never } from '~/helpers/never'
import deMessages from '~/translations/de.json'
import enMessages from '~/translations/en.json'

type Props = PropsWithChildren

const LocaleProvider = ({ children }: Props) => {
    const [locale, setLocale] = useState<Locale>(Locale.DE)

    const messages = useMemo(() => {
        switch (locale) {
            case Locale.DE:
                return deMessages
            case Locale.EN:
                return enMessages
            default:
                return never(locale, `Unexpected Locale: ${locale}. This should never happen.`)
        }
    }, [locale])

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <IntlProvider
                locale={locale}
                messages={messages}
            >
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    )
}

export default LocaleProvider
