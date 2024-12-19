import { deeplApiKey } from '@env'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback } from 'react'

type Props = {
    text: string
}

export const useDeepLTranslationMutation = () => {
    const mutationFn = useCallback(async ({ text }: Props) => {
        const { data } = await axios.post(
            'https://api-free.deepl.com/v2/translate',
            {
                text: [text],
                // eslint-disable-next-line camelcase
                target_lang: 'EN',
                // eslint-disable-next-line camelcase
                source_lang: 'DE',
                // eslint-disable-next-line camelcase
                preserve_formatting: true,
            },
            {
                headers: {
                    Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY ?? deeplApiKey}`,
                    'Content-Type': 'application/json',
                },
            },
        )

        return data.translations[0].text
    }, [])

    return useMutation({
        mutationFn,
    })
}
