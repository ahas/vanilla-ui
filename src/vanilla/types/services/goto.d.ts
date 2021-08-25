// Types
import Vue from "vue";

export type VanillaGoToTarget = number | string | HTMLElement | Vue;

export type VanillaGoToEasing =
    | ((t: number) => number)
    | "linear"
    | "easeInQuad"
    | "easeOutQuad"
    | "easeInOutQuad"
    | "easeInCubic"
    | "easeOutCubic"
    | "easeInOutCubic"
    | "easeInQuart"
    | "easeOutQuart"
    | "easeInOutQuart"
    | "easeInQuint"
    | "easeOutQuint"
    | "easeInOutQuint";

export interface GoToOptions {
    container?: string | HTMLElement | Vue;
    duration?: number;
    offset?: number;
    easing?: VanillaGoToEasing;
    appOffset?: boolean;
}

export default function goTo(target: VanillaGoToTarget, options?: GoToOptions): Promise<number>;
