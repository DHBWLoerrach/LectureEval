import { IntlShape } from 'react-intl'
import { Page } from '~/enums/Page'
import { never } from '~/helpers/never'
import { translations } from '~/translations/translations'

export const getPageTranslation = (page: Page, intl: IntlShape) => {
    switch (page) {
        case Page.StudentView:
            return '//TODO'
        case Page.LecturerView:
            return '//TODO'
        case Page.ManagementView:
            return intl.formatMessage(translations.management)
        case Page.LecturesView:
            return intl.formatMessage(translations.lectures)
        case Page.FormsView:
            return intl.formatMessage(translations.forms)
        case Page.CourseManagement:
            return intl.formatMessage(translations.courseManagement)
        case Page.LectureManagement:
            return intl.formatMessage(translations.lectureManagement)
        case Page.FormsManagement:
            return intl.formatMessage(translations.formsManagement)
        case Page.RatingManagement:
            return intl.formatMessage(translations.ratingManagement)
        case Page.StudentManagement:
            return intl.formatMessage(translations.studentManagement)
        case Page.LecturerManagement:
            return intl.formatMessage(translations.lecturerManagement)
        default:
            never(page, `Unexpected page: ${page}. This should never happen.`)
    }
}
