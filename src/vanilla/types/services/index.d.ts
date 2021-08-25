// Types
import Vue from "vue";
import Framework from "../";
import { VanillaPreset } from "./presets";

export interface VanillaServiceContract {
    framework: Record<string, VanillaServiceContract>;
    init: (root: Vue, ssrContext?: object) => void;
}

export interface VanillaService {
    property: string;
    new (preset: VanillaPreset, parent: InstanceType<typeof Framework>): VanillaServiceContract;
}
