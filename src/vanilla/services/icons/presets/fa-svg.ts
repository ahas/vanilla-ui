import { VanillaIcons } from "../../../types/services/icons";
import { Component } from "vue";
import icons from "./fa";

export function convertToComponentDeclarations(component: Component | string, iconSet: VanillaIcons) {
    const result: Partial<VanillaIcons> = {};

    for (const key in iconSet) {
        result[key] = {
            component,
            props: {
                icon: (iconSet[key] as string).split(" fa-"),
            },
        };
    }

    return result as VanillaIcons;
}

export default convertToComponentDeclarations("font-awesome-icon", icons);
