import { defineMessages as baseDefineMessages, MessageDescriptor } from 'react-intl'

type MessageRecord<K extends string> = Record<K, Omit<MessageDescriptor, 'id'>>

/**
 * This function helps us to define messages more easily.\
 * It automatically assigns the key of a message as the id of the message.\
 * This reduces the redundancy of having to write the key twice and reduces the risk of typos.
 */
const defineMessages = <T extends MessageRecord<keyof T & string>>(messages: T) => {
    const withIds = Object.keys(messages).reduce(
        (acc, key) => {
            acc[key as keyof T] = {
                ...messages[key as keyof T],
                id: key,
            }
            return acc
        },
        {} as Record<keyof T, MessageDescriptor>,
    )

    return baseDefineMessages(withIds)
}

export const translations = defineMessages({
    loginTitle: {
        defaultMessage: 'Anmelden',
    },
    emailLabel: {
        defaultMessage: 'E-Mail Adresse',
    },
    passwordLabel: {
        defaultMessage: 'Passwort',
    },
})
