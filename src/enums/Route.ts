/**
 * Contains unique identifiers for each view.
 *
 * This should never be used as a display value.
 * To get translated display values, please use `~/helpers/getPageTranslation.ts`.
 */
export enum Route {
    StudentView = 'studentView',
    LecturerView = 'lecturerView',
    ManagementView = 'managementView',
    LecturesView = 'lecturesView',
    FormsView = 'formsView',
    CourseManagement = 'courseManagement',
    LectureManagement = 'lectureManagement',
    FormsManagement = 'formsManagement',
    RatingManagement = 'ratingManagement',
    StudentManagement = 'studentManagement',
    LecturerManagement = 'lecturerManagement',
    FormDesigner = 'formDesigner',
}
