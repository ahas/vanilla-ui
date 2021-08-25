import { Breakpoint, BreakpointOptions } from "./breakpoint";
import { Icons, IconsOptions } from "./icons";
import { Lang, LangOptions } from "./lang";
import { Theme, ThemeOptions } from "./theme";

export interface VanillaPreset {
    breakpoint: {
        mobileBreakpoint: Breakpoint["mobileBreakpoint"];
        scrollBarWidth: Breakpoint["scrollBarWidth"];
        thresholds: Breakpoint["thresholds"];
    };
    icons: {
        component?: Icons["component"];
        iconfont: Icons["iconfont"];
        // TODO: Remove partial for v3
        values: Icons["values"];
    };
    lang: {
        current: Lang["current"];
        locales: Lang["locales"];
        t: Lang["t"];
    };
    theme: {
        dark: Theme["dark"];
        default: Theme["default"];
        disable: Theme["disable"];
        options: Theme["options"];
        themes: Theme["themes"];
    };

    [name: string]: any;
}

export interface UserVanillaPreset extends GlobalVanillaPreset {
    preset?: GlobalVanillaPreset;

    [name: string]: any;
}

export interface GlobalVanillaPreset {
    breakpoint?: BreakpointOptions;
    icons?: IconsOptions;
    lang?: LangOptions;
    theme?: ThemeOptions;

    [name: string]: any;
}

export interface Presets {
    preset: UserVanillaPreset;
}
