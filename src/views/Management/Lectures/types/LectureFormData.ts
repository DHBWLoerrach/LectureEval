import { Lecture } from '~/types/Lecture';

export type LectureFormData = Lecture & {
  id?: number;
};
