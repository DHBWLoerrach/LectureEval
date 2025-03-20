import { Course } from '~/types/Course';

export type CourseFormData = Course & {
  id?: number;
};
