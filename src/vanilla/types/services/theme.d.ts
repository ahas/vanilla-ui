export interface Theme {
    dark: boolean;
    disable: boolean;
    default: string | false;
    options: {
        /** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#Unsafe_inline_script */
        cspNonce?: string;
        customProperties?: boolean;
        minifyTheme?: ThemeMinifyTheme;
        themeCache?: VanillaThemeCache;
        variations?: boolean;
    };
    themes: {
        dark: VanillaThemeVariant;
        light: VanillaThemeVariant;
    };
    readonly currentTheme: Partial<VanillaThemeVariant>;
}

export interface ThemeOptions {
    dark?: boolean;
    disable?: boolean;
    default?: string | false;
    options?: {
        /** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#Unsafe_inline_script */
        cspNonce?: string;
        customProperties?: boolean;
        minifyTheme?: ThemeMinifyTheme;
        themeCache?: VanillaThemeCache;
        variations?: boolean;
    };
    themes?: {
        dark?: Partial<VanillaThemeVariant>;
        light?: Partial<VanillaThemeVariant>;
    };
}

export interface VanillaThemes {
    dark: VanillaThemeVariant;
    light: VanillaThemeVariant;
}

export interface VanillaThemeVariant {
    [name: string]: VanillaThemeItem | string | number | undefined;

    primary: VanillaThemeItem;
    secondary: VanillaThemeItem;
    accent: VanillaThemeItem;
    info: VanillaThemeItem;
    warning: VanillaThemeItem;
    error: VanillaThemeItem;
    success: VanillaThemeItem;
    anchor?: string | number;
}

export interface VanillaThemeCache {
    get: (parsedTheme: VanillaParsedTheme) => string | null;
    set: (parsedTheme: VanillaParsedTheme, css: string) => void;
}

export interface VanillaParsedTheme {
    [name: string]: VanillaParsedThemeItem;
}

export interface VanillaParsedThemeItem {
    base: string;
    lighten5: string;
    lighten4: string;
    lighten3: string;
    lighten2: string;
    lighten1: string;
    darken1: string;
    darken2: string;
    darken3: string;
    darken4: string;
}

export type VanillaThemeItem = Partial<VanillaParsedThemeItem> | string | number | undefined;

export type ThemeMinifyTheme = ((css: string) => string) | null;
