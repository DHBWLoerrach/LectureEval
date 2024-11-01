/**
 * @file compileMessages.mjs
 * @description This is a helper script to make working locally with react-intl / formatjs easier.
 *              It compiles messages extracted with `extractMessages.mjs` into the json format required by react-intl.
 *
 * @usage
 * Run the script with `node --experimental-json-modules scripts/compileMessages.mjs`
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
 * The directory where the extracted messages are stored
 */
const messagesDir = 'src/translations/extracted'
/**
 * Output path for the compiles json files
 */
const outputDir = 'src/translations'

/**
 * Function to compile the extracted messages into the json format required by react-intl.\
 *
 * Extracted format:
 * ```
 * {
 *   messageIdenfitier: {
 *     message: 'The default message',
 *     needsTranslation: true
 *   }
 * }
 * ```
 *
 * Compiled format:
 * ```json
 * {
 *   "messageIdenfitier": "The translated message"
 * }
 * ```
 */
const compileMessages = () => {
    locales.forEach((locale) => {
        const localeFilePath = path.join(messagesDir, `${locale}.json`)

        // Check if the extracted locale file exists
        if (!fs.existsSync(localeFilePath)) {
            console.error(`Locale file ${localeFilePath} does not exist.`)
            return
        }

        // Load existing messages for the locale
        const existingMessages = JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
        const compiledMessages = {}

        // Transform the messages to the desired format
        Object.keys(existingMessages)
            // sort by identifier
            .sort()
            .forEach((key) => {
                // Set the compiled message with the translated defaultMessage as the value
                compiledMessages[key] = existingMessages[key].message
            })

        // Define the output file path
        const outputFilePath = path.join(outputDir, `${locale}.json`)

        // Write the compiled messages back to the output file
        fs.writeFileSync(outputFilePath, `${JSON.stringify(compiledMessages, null, 2)}`)
        console.log(`Compiled messages for locale "${locale}" written to ${outputFilePath}.`)
    })
}

compileMessages()
