export interface Lang {
    locales: LangLocales;
    current: string;
    t: LangTranslator;
}

export interface LangOptions {
    locales?: LangLocales;
    current?: string;
    t?: LangTranslator;
}

// TODO: complete list of keys?
export interface VanillaLocale {
    [key: string]: VanillaLocale | string;
}

export type LangLocales = Record<string, VanillaLocale>;
export type LangTranslator = (key: string, ...params: Array<string | number>) => string;
