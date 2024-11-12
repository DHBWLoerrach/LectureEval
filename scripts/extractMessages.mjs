/**
 * @file extractMessages.mjs
 * @description This is a helper script to make working locally with react-intl / formatjs easier.
 *              It extracts all messages from the translations file and writes them to the respective locale files.
 *
 *              While extracting, new messages are marked with a `needsTranslation` flag.
 *              The default locale (de) doesn't have this flag, as it is assumed that all messages are translated.
 *              The script is intended to be run manually whenever new messages are added to the translations file.
 *
 *              Existing translations will never be overriden, only new ones added to the extracted file.
 *              The script will create a new directory `extracted` in `src/translations`, where the extracted files will be stored locally.
 *              This directory should be added to the `.gitignore` file since local translation versions may differ.
 *
 * @usage
 * Run the script with `node --experimental-json-modules scripts/extractMessages.mjs`
 *
 * @dependencies
 * - node: for access to the filesystem and path handling
 */
import fs from 'fs'
import path from 'path'

/**
 * An array of locale strings - must match the values of ~/enums/Locale
 */
const locales = ['de', 'en']
/**
 * The directory where the translations are stored
 */
const messagesDir = 'src/translations'
/**
 * The directory where the extracted translations are stored
 */
const extractedDir = path.join(messagesDir, 'extracted')
/**
 * The file where the messages are defined
 */
const translationsFile = 'src/translations/translations.ts'

// Ensure the directories exists
if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true })
}
if (!fs.existsSync(extractedDir)) {
    fs.mkdirSync(extractedDir, { recursive: true })
}

/**
 * This function reads the translations file and extracts all messages using a regex.\
 * Messages are brought into the following format:
 *
 * ```
 * {
 *   messageIdenfitier: {
 *     message: 'The default message',
 *     needsTranslation: true
 *   }
 * }
 * ```
 *
 * In the beginning for all defined messages needsTranslation is set to true.\
 * This will be evaluated in a later step.
 *
 *
 */
const createMessagesObject = () => {
    const fileContent = fs.readFileSync(translationsFile, 'utf-8')

    // Regex to extract keys and their default messages from defineMessages
    const messageRegex = /(\w+):\s*{[^}]*defaultMessage:\s*['"]([^'"]+)['"]/g

    let match
    const messages = {}

    while ((match = messageRegex.exec(fileContent)) !== null) {
        const key = match[1]
        const message = match[2]
        messages[key] = {
            message,
            needsTranslation: true,
        }
    }

    return messages
}

/**
 * Transforms the existing messages json file into the extraction format.\
 * This is necessary to merge the new messages with the existing ones.\
 *
 * Initial format:
 * ```json
 * {
 *   "messageIdenfitier": "The default message"
 * }
 * ```
 *
 * Output format:
 * ```
 * {
 *   messageIdenfitier: {
 *     message: "The default message"
 *   }
 * }
 */
function transformExistingJson(obj) {
    const newObj = {}

    // Loop through all messageIdentifiers
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // And create a new object
            // with the json key as identifier
            // and the json value as the defaultMessage
            newObj[key] = {
                message: obj[key],
            }
        }
    }

    return newObj
}

/**
 * Merges the extracted messages with the existing ones.\
 * This ensures that in the extracted file all messages are present and only the new ones contain the defaultMessage from the definition.
 *
 * Existing messages are kept as they are and no `needsTranslation` flag is added.
 * For the default locale (de) the `needsTranslation` flag is removed.
 */
const mergeMessages = (existingMessages, newMessages, locale) => {
    const mergedMessages = transformExistingJson(existingMessages)

    // Check if any keys exist in the merged messages but not in the new messages
    for (const key in mergedMessages) {
        // Delete removed translations
        if (!newMessages[key]) delete mergedMessages[key]
    }

    for (const key in newMessages) {
        if (!mergedMessages[key]) {
            // If the message doesn't exist, add it
            if (locale === 'de') {
                mergedMessages[key] = {
                    message: newMessages[key].message,
                }
                continue
            }
            mergedMessages[key] = newMessages[key]
        }
    }

    return mergedMessages
}

/**
 * This is the actual logic function to extract all messages.\
 * This function first generates the new messages object from the translations file.\
 * Then it loads the existing messages for each locale and merges them with the new messages.\
 * The merged messages are then written back to the respective locale file.\
 * The output is written to the `extracted` directory in the messages directory.
 */
const extractMessages = () => {
    // Create new messages object from translations file
    const newMessages = createMessagesObject()

    locales.forEach((locale) => {
        const localeFilePath = path.join(messagesDir, `${locale}.json`)
        const outputPath = path.join(extractedDir, `${locale}.json`)

        // Load existing messages for the locale or initialize an empty object
        let existingMessages = {}
        if (fs.existsSync(localeFilePath)) {
            existingMessages = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
        }

        // Merge existing messages with new messages
        const mergedMessages = mergeMessages(existingMessages, newMessages, locale)
        const sortedMessages = Object.keys(mergedMessages)
            // Sort the messages by key
            .sort()
            // Create an object containing the sorted messages
            .reduce((sorted, key) => {
                sorted[key] = mergedMessages[key]

                return sorted
            }, {})

        // Write merged messages back to the locale file
        fs.writeFileSync(outputPath, JSON.stringify(sortedMessages, null, 2))
        console.log(`Successfully extracted messages to "${outputPath}".`)
    })
}

extractMessages()
