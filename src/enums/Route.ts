/**
 * Contains unique identifiers for each view.
 *
 * This should never be used as a display value.
 * To get translated display values, please use `~/helpers/getPageTranslation.ts`.
 */
export enum Route {
    Start = 'start',
    StudentView = 'studentView',
    LecturerView = 'lecturerView',
    ManagementView = 'managementView',
    LecturesView = 'lecturesView',
    FormsView = 'formsView',
    DetailView = 'detailView',
    CourseManagement = 'courseManagement',
    LectureManagement = 'lectureManagement',
    FormsManagement = 'formsManagement',
    FormReleaseManagement = 'formReleaseManagement',
    StudentManagement = 'studentManagement',
    LecturerManagement = 'lecturerManagement',
    FormDesigner = 'formDesigner',
    DepartmentsManagement = 'departmentsManagement',
}
