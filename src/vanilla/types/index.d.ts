import Vue, { Component, PluginFunction, VueConstructor, DirectiveOptions } from "vue";
import { Application } from "./services/application";
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
    application: Application;
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

export type DatePickerFormatter = (date: string) => string;
export type DatePickerAllowedDatesFunction = (date: string) => boolean;
export type DatePickerEventColorValue = string | string[];
export type DatePickerEvents = string[] | ((date: string) => boolean | DatePickerEventColorValue) | Record<string, DatePickerEventColorValue>;
export type DatePickerEventColors = DatePickerEventColorValue | Record<string, DatePickerEventColorValue> | ((date: string) => DatePickerEventColorValue);
export type DatePickerType = "date" | "month";
export type DatePickerMultipleFormatter = (date: string[]) => string;

export interface TouchHandlers {
    start?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
    end?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
    move?: (wrapperEvent: TouchEvent & TouchWrapper) => void;
    left?: (wrapper: TouchWrapper) => void;
    right?: (wrapper: TouchWrapper) => void;
    up?: (wrapper: TouchWrapper) => void;
    down?: (wrapper: TouchWrapper) => void;
}

export interface TouchWrapper extends TouchHandlers {
    touchstartX: number;
    touchstartY: number;
    touchmoveX: number;
    touchmoveY: number;
    touchendX: number;
    touchendY: number;
    offsetX: number;
    offsetY: number;
}

export type InputValidationRule = (value: any) => string | boolean;
export type InputMessage = string | string[];
export type InputValidationRules = (InputValidationRule | string)[];

export type CalendarCategory =
    | string
    | {
          name?: string;
          categoryName?: string;
          [key: string]: any;
      };

export type CalendarCategoryTextFunction = (category: CalendarCategory) => string;

export interface CalendarTimestamp {
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    weekday: number;
    hour: number;
    minute: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
    category?: CalendarCategory;
}

export type CalendarFormatter = (timestamp: CalendarTimestamp, short: boolean) => string;

export interface CalendarEvent {
    [prop: string]: any;
}

export interface CalendarEventParsed {
    input: CalendarEvent;
    start: CalendarTimestamp;
    startIdentifier: number;
    startTimestampIdentifier: number;
    end: CalendarTimestamp;
    endIdentifier: number;
    endTimestampIdentifier: number;
    allDay: boolean;
    index: number;
    category: string | false;
}

export interface CalendarEventVisual {
    event: CalendarEventParsed;
    columnCount: number;
    column: number;
    left: number;
    width: number;
}

export interface CalendarDaySlotScope extends CalendarTimestamp {
    outside: boolean;
    index: number;
    week: CalendarTimestamp[];
    category: CalendarCategory;
}

export type CalendarTimeToY = (time: CalendarTimestamp | number | string, clamp?: boolean) => number;

export type CalendarTimeDelta = (time: CalendarTimestamp | number | string) => number | false;

export interface CalendarDayBodySlotScope extends CalendarDaySlotScope {
    timeToY: CalendarTimeToY;
    timeDelta: CalendarTimeDelta;
}

export type CalendarEventOverlapMode = (
    events: CalendarEventParsed[],
    firstWeekday: number,
    overlapThreshold: number,
) => (day: CalendarDaySlotScope, dayEvents: CalendarEventParsed[], timed: boolean, reset: boolean) => CalendarEventVisual[];

export type CalendarEventColorFunction = (event: CalendarEvent) => string;

export type CalendarEventTimedFunction = (event: CalendarEvent) => boolean;

export type CalendarEventCategoryFunction = (event: CalendarEvent) => string;

export type CalendarEventNameFunction = (event: CalendarEventParsed, timedEvent: boolean) => string;
