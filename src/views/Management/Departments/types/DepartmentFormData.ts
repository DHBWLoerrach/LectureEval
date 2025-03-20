import { Department } from '~/types/Department';

export type DepartmentFormData = Department & {
  id?: number;
};
