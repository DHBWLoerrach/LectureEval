import { IntlShape } from 'react-intl'
import { Route } from '~/enums/Route'
import { never } from '~/helpers/never'
import { translations } from '~/translations/translations'

export const getPageTranslation = (page: Route, intl: IntlShape) => {
    switch (page) {
        case Route.StudentView:
            return '//TODO'
        case Route.LecturerView:
            return '//TODO'
        case Route.ManagementView:
            return intl.formatMessage(translations.management)
        case Route.LecturesView:
            return intl.formatMessage(translations.lectures)
        case Route.FormsView:
            return intl.formatMessage(translations.forms)
        case Route.CourseManagement:
            return intl.formatMessage(translations.courseManagement)
        case Route.LectureManagement:
            return intl.formatMessage(translations.lectureManagement)
        case Route.FormsManagement:
            return intl.formatMessage(translations.formsManagement)
        case Route.RatingManagement:
            return intl.formatMessage(translations.ratingManagement)
        case Route.StudentManagement:
            return intl.formatMessage(translations.studentManagement)
        case Route.LecturerManagement:
            return intl.formatMessage(translations.lecturerManagement)
        case Route.FormDesigner:
            return intl.formatMessage(translations.formDesigner)
        case Route.DepartmentsManagement:
            return intl.formatMessage(translations.departments)
        default:
            return never(page, `Unexpected page: ${page}. This should never happen.`)
    }
}
