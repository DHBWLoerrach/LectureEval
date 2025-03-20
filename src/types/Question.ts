import { QuestionType } from '~/enums/QuestionType';

export type Question = {
  id: number;
  question: string;
  isRequired: boolean;
  serial: number;
  typeID: QuestionType;
  stepID: number;
};
