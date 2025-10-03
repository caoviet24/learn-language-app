export interface LanguageOption {
    id: number;
    name: string;
    flag: string; // Emoji representation of the flag
    code: string; // ISO language code
}

export interface RoleOption {
    id: number;
    name: string;
}

export interface LevelOption {
    id: number;
    name: string;
}

export interface GoalOption {
    id: number;
    name: string;
    minutes: number;
}
const languageOptions = [
    { id: 1, name: 'English', flag: '🇺🇸', code: 'en' },
    { id: 2, name: 'Spanish', flag: '🇪🇸', code: 'es' },
    { id: 3, name: 'French', flag: '🇫🇷', code: 'fr' },
    { id: 4, name: 'German', flag: '🇩🇪', code: 'de' },
    { id: 5, name: 'Japanese', flag: '🇯🇵', code: 'ja' },
    { id: 6, name: 'Korean', flag: '🇰🇷', code: 'ko' },
    { id: 7, name: 'Chinese', flag: '🇨🇳', code: 'zh' },
    { id: 8, name: 'Vietnamese', flag: '🇻🇳', code: 'vi' },
    { id: 9, name: 'Italian', flag: '🇮🇹', code: 'it' },
    { id: 10, name: 'Portuguese', flag: '🇧🇷', code: 'pt' },
];

const roleOptions: RoleOption[] = [
    { id: 1, name: 'Student' },
    { id: 2, name: 'Professional' },
    { id: 3, name: 'Traveler' },
    { id: 4, name: 'Immigrant' },
    { id: 5, name: 'Language Enthusiast' },
    { id: 6, name: 'Other' },
];

const levelOptions: LevelOption[] = [
    { id: 1, name: 'Beginner' },
    { id: 2, name: 'Elementary' },
    { id: 3, name: 'Intermediate' },
    { id: 4, name: 'Upper Intermediate' },
    { id: 5, name: 'Advanced' },
    { id: 6, name: 'Native' },
    { id: 7, name: 'Other' },
];

const goalOptions: GoalOption[] = [
    { id: 1, name: '5 minutes', minutes: 5 },
    { id: 2, name: '10 minutes', minutes: 10 },
    { id: 3, name: '20 minutes', minutes: 20 },
    { id: 4, name: '30 minutes', minutes: 30 },
    { id: 5, name: '60 minutes', minutes: 60 },
];

export { languageOptions, roleOptions, levelOptions, goalOptions };
