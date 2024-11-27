import { defineMessages as baseDefineMessages, MessageDescriptor } from 'react-intl'

type MessageRecord<K extends string> = Record<K, Omit<MessageDescriptor, 'id'>>

/**
 * This function helps us to define messages more easily.\
 * It automatically assigns the key of a message as the id of the message.\
 * This reduces the redundancy of having to write the key twice and reduces the risk of typos.
 */
const defineMessages = <T extends MessageRecord<keyof T & string>>(messages: T) => {
    const withIds = Object.keys(messages).reduce(
        (acc, key) => {
            acc[key as keyof T] = {
                ...messages[key as keyof T],
                id: key,
            }
            return acc
        },
        {} as Record<keyof T, MessageDescriptor>,
    )

    return baseDefineMessages(withIds)
}

export const translations = defineMessages({
    german: {
        defaultMessage: '🇩🇪 Deutsch',
    },
    english: {
        defaultMessage: '🇬🇧 Englisch',
    },
    login: {
        defaultMessage: 'Anmelden',
    },
    emailAdress: {
        defaultMessage: 'E-Mail Adresse',
    },
    password: {
        defaultMessage: 'Passwort',
    },
    management: {
        defaultMessage: 'Verwaltung',
    },
    students: {
        defaultMessage: 'Studierende',
    },
    entities: {
        defaultMessage: 'Entitäten',
    },
    courses: {
        defaultMessage: 'Kurse',
    },
    forms: {
        defaultMessage: 'Formulare',
    },
    form: {
        defaultMessage: 'Formular',
    },
    ratings: {
        defaultMessage: 'Bewertungen',
    },
    lecturers: {
        defaultMessage: 'Dozierende',
    },
    users: {
        defaultMessage: 'Benutzer*innen',
    },
    entityCreated: {
        defaultMessage: '{article} {entity} wurde erstellt.',
    },
    entityDeleted: {
        defaultMessage: '{article} {entity} wurde gelöscht.',
    },
    maleArticle: {
        defaultMessage: 'Der',
    },
    femaleArticle: {
        defaultMessage: 'Die',
    },
    neutralArticle: {
        defaultMessage: 'Das',
    },
    changesSaved: {
        defaultMessage: 'Die Änderungen wurden gespeichert.',
    },
    error: {
        defaultMessage: 'Fehler',
    },
    errorDescription: {
        defaultMessage: 'Ein unerwarteter Fehler ist aufgetreten.',
    },
    deleteEntityHeader: {
        defaultMessage: '{entity} löschen?',
    },
    deleteEntityDescription: {
        defaultMessage: '{name} wird unwiderruflich gelöscht.',
    },
    editEntityHeader: {
        defaultMessage: '{entity} bearbeiten',
    },
    createEntityHeader: {
        defaultMessage: '{entity} erstellen',
    },
    required: {
        defaultMessage: 'Dies ist ein Pflichtfeld.',
    },
    cancel: {
        defaultMessage: 'Abbrechen',
    },
    continue: {
        defaultMessage: 'Fortfahren',
    },
    save: {
        defaultMessage: 'Speichern',
    },
    name: {
        defaultMessage: 'Name',
    },
    department: {
        defaultMessage: 'Studiengang',
    },
    loginError: {
        defaultMessage: 'Login fehlgeschlagen',
    },
    loginErrorDescription: {
        defaultMessage: 'Bitte überprüfe deine Angaben und versuche es erneut.',
    },
    invalidEmail: {
        defaultMessage: 'Bitte gebe eine gültige E-Mail Adresse ein.',
    },
    imprint: {
        defaultMessage: 'Impressum',
    },
    privacy: {
        defaultMessage: 'Datenschutz',
    },
    results: {
        defaultMessage: 'Auswertung',
    },
    logout: {
        defaultMessage: 'Abmelden',
    },
    lectures: {
        defaultMessage: 'Vorlesungen',
    },
    lectureEvaluation: {
        defaultMessage: 'Vorlesung bewerten',
    },
    courseManagement: {
        defaultMessage: 'Kurse verwalten',
    },
    lectureManagement: {
        defaultMessage: 'Vorlesungen verwalten',
    },
    formsManagement: {
        defaultMessage: 'Formulare verwalten',
    },
    ratingManagement: {
        defaultMessage: 'Bewertungen verwalten',
    },
    studentManagement: {
        defaultMessage: 'Studierende verwalten',
    },
    lecturerManagement: {
        defaultMessage: 'Dozierende verwalten',
    },
    loginTitle: {
        defaultMessage: 'Anmelden',
    },
    formDesigner: {
        defaultMessage: 'Formular-Designer',
    },
    stepHeading: {
        defaultMessage: 'Schritt {current} von {max}',
    },
    stepLabel: {
        defaultMessage: 'Schritt',
    },
    titleLabel: {
        defaultMessage: 'Titel',
    },
    subTitleLabel: {
        defaultMessage: 'Untertitel',
    },
    question: {
        defaultMessage: 'Frage',
    },
    privacyNotice: {
        defaultMessage: 'Datenschutzhinweis',
    },
    privacyMoreInfo: {
        defaultMessage: 'Weitere Infos zum Datenschutz',
    },
    acceptAndContinue: {
        defaultMessage: 'Zustimmen und weiter',
    },
    privacyStepSubTitle: {
        defaultMessage: 'Bitte stimme den Datenschutzbestimmungen zu.',
    },
    agree: {
        defaultMessage: 'Stimme voll zu',
    },
    disagree: {
        defaultMessage: 'Stimme nicht zu',
    },
    next: {
        defaultMessage: 'Weiter',
    },
    back: {
        defaultMessage: 'Zurück',
    },
    addStep: {
        defaultMessage: 'Schritt hinzufügen',
    },
    questionType: {
        defaultMessage: 'Fragen-Typ',
    },
    questionTypeRating: {
        defaultMessage: 'Sterne-Bewertung',
    },
    questionTypeText: {
        defaultMessage: 'Freitext',
    },
    formNameExists: {
        defaultMessage: 'Ein Formular mit diesem Namen existiert bereits.',
    },
    departments: {
        defaultMessage: 'Studiengänge',
    },
    location: {
        defaultMessage: 'Standort',
    },
    search: {
        defaultMessage: 'Suche',
    },
    lecture: {
        defaultMessage: 'Vorlesung',
    },
    semester: {
        defaultMessage: 'Semester',
    },
    lectureNameExists: {
        defaultMessage: 'Eine Vorlesung mit diesem Namen existiert bereits.',
    },
    lecturesSearch: {
        defaultMessage: 'Vorlesungssuche',
    },
    myLectures: {
        defaultMessage: 'Meine Vorlesungen',
    },
    allLectures: {
        defaultMessage: 'Alle Vorlesungen',
    },
    rating: {
        defaultMessage: 'Bewertung',
    },
    stars: {
        defaultMessage: 'Sterne',
    },
    difficulty: {
        defaultMessage: 'Schwierigkeit',
    },
    noUserRole: {
        defaultMessage: 'Keine Benutzerrolle',
    },
    notSet: {
        defaultMessage: 'Nicht gesetzt',
    },
})
