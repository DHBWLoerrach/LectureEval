import { Question } from '~/types/Question'

export type QuestionFormData = Question & {
    id?: number
}
