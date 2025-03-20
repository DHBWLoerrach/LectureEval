import { CourseAssignment } from '~/types/CourseAssignment';

export type CourseAssignmentFormData = CourseAssignment & {
  id?: number;
};
