import { deeplApiKey } from '@env'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback } from 'react'

type Props = {
    text: string
}

/**
 * This query is used to translate a text from German to English using the DeepL API.
 *
 * To use this query, you need to provide a valid DeepL API key in the .env file.
 *
 * For more information on how to use the DeepL API see the official documentation: https://developers.deepl.com/docs
 */
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
