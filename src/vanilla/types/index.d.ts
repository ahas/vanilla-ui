import Vue, { Component, PluginFunction, VueConstructor, DirectiveOptions } from "vue";
import { Breakpoint } from "./services/breakpoint";
import { Icons } from "./services/icons";
import { Lang } from "./services/lang";
import { Presets, UserVanillaPreset, VanillaPreset } from "./services/presets";
import { Theme } from "./services/theme";

export default class Vanilla {
    constructor(preset?: Partial<UserVanillaPreset>);

    static install: PluginFunction<VanillaUseOptions>;
    static version: string;
    static config: Config;

    framework: Framework;
    preset: VanillaPreset;
    userPreset: UserVanillaPreset;
}

export interface Config {
    silent: boolean;
}

export type ComponentOrPack = Component & {
    $_vanilla_subcomponents?: Record<string, ComponentOrPack>;
};

export interface VanillaUseOptions {
    transitions?: Record<string, VueConstructor>;
    directives?: Record<string, DirectiveOptions>;
    components?: Record<string, ComponentOrPack>;
}

export interface Framework {
    readonly breakpoint: Breakpoint;
    readonly goTo: <T extends string | number | HTMLElement | Vue>(target: T, options?: GetRootNodeOptions) => Promise<T>;
    application: ApplicationCache;
    theme: Theme;
    icons: Icons;
    lang: Lang;
    presets: Presets;
    rtl: boolean;
}

declare module "vue/types/vue" {
    export interface Vue {
        $vanilla: Framework;
    }
}

declare module "vue/types/options" {
    export interface ComponentOptions<
        V extends Vue,
        Data = DefaultData<V>,
        Methods = DefaultMethods<V>,
        Computed = DefaultComputed,
        PropsDef = PropsDefinition<DefaultProps>,
        Props = DefaultProps,
    > {
        vanilla?: Vanilla;
    }
}

// Public types
export type DataTableCompareFunction<T = any> = (a: T, b: T) => number;

export type SelectItemKey = string | (string | number)[] | ((item: object, fallback?: any) => any);

export interface ItemGroup<T> {
    name: string;
    items: T[];
}
