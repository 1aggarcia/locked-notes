export const LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = typeof LANGUAGES[number];

type Translation = string | ((...args: string[]) => string);
export type DisplayTextRecord = Record<string, Record<SupportedLanguage, Translation>>;

/**
 * Maps a text record object into a translation record for a specific
 * language that consumers use.
 * https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
 * 
 * I could have just used simple Records and strings, but this mapped type
 * gives consumers the best possible type inference, i.e. showing them the
 * string literals that can be used for every translation.
 */
export type DisplayTranslation<T extends DisplayTextRecord> = {
    [key in keyof T]: T[key][SupportedLanguage]
};

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    en: "English",
    es: "Español",
};

export function getTranslations<T extends DisplayTextRecord>(
    textRecord: T,
    language: SupportedLanguage
) {
    return Object.fromEntries(
        Object.entries(textRecord)
            .map(([key, value]) => [key, value[language]])
    ) as DisplayTranslation<T>;
}
