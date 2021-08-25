// Types
import { Component } from "vue";

export interface Icons extends IconsOptions {
    iconfont: Iconfont;
    values: VanillaIcons;
}

export type Iconfont = "mdi" | "mdiSvg" | "md" | "fa" | "faSvg" | "fa4";

export interface IconsOptions {
    component?: Component | string;
    /**
     * Select a base icon font to use. Note that none of these are included, you must install them yourself
     *
     * md: <a href="https://material.io/icons">material.io</a> (default)
     * mdi: <a href="https://materialdesignicons.com">MDI</a>
     * fa: <a href="https://fontawesome.com/get-started/web-fonts-with-css">FontAwesome 5</a>
     * fa4: <a href="https://fontawesome.com/v4.7.0/">FontAwesome 4</a>
     * faSvg: <a href="https://fontawesome.com/how-to-use/on-the-web/using-with/vuejs">FontAwesome SVG</a>
     */
    iconfont?: Iconfont;
    values?: Partial<VanillaIcons>;
}

export type VanillaIconComponent = {
    component: Component | string;
    props?: object;
};

export type VanillaIcon = string | VanillaIconComponent;

export interface VanillaIcons {
    complete: VanillaIcon;
    cancel: VanillaIcon;
    close: VanillaIcon;
    delete: VanillaIcon;
    clear: VanillaIcon;
    success: VanillaIcon;
    info: VanillaIcon;
    warning: VanillaIcon;
    error: VanillaIcon;
    prev: VanillaIcon;
    next: VanillaIcon;
    checkboxOn: VanillaIcon;
    checkboxOff: VanillaIcon;
    checkboxIndeterminate: VanillaIcon;
    delimiter: VanillaIcon;
    sort: VanillaIcon;
    expand: VanillaIcon;
    menu: VanillaIcon;
    subgroup: VanillaIcon;
    dropdown: VanillaIcon;
    radioOn: VanillaIcon;
    radioOff: VanillaIcon;
    edit: VanillaIcon;
    ratingEmpty: VanillaIcon;
    ratingFull: VanillaIcon;
    ratingHalf: VanillaIcon;
    loading: VanillaIcon;
    first: VanillaIcon;
    last: VanillaIcon;
    unfold: VanillaIcon;
    file: VanillaIcon;
    plus: VanillaIcon;
    minus: VanillaIcon;
    [name: string]: VanillaIcon;
}
