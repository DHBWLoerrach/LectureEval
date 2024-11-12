import { IntlShape } from 'react-intl'
import { QuestionType } from '~/enums/QuestionType'
import { never } from '~/helpers/never'
import { translations } from '~/translations/translations'

export const getQuestionTypeTranslation = (type: QuestionType, intl: IntlShape) => {
    switch (type) {
        case QuestionType.Rating:
            return intl.formatMessage(translations.questionTypeRating)
        case QuestionType.Text:
            return intl.formatMessage(translations.questionTypeText)
        default:
            return never(type, `Unexpected questionType: ${type}. This should never happen.`)
    }
}
