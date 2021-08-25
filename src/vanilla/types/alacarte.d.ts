declare module "vanilla/es5/install" {
    import { VueConstructor } from "vue";

    const install: (Vue: VueConstructor, args: {}) => void;

    export { install };
}
declare module "vanilla/es5/components/Vanilla" {
    import Vanilla from "vanilla";

    export default Vanilla;
}

declare module "vanilla/es5/components/*" {
    import { ComponentOrPack } from "vanilla";
    import { VueConstructor } from "vue";

    const VanillaComponent: {
        default: ComponentOrPack & VueConstructor;
        [key: string]: ComponentOrPack & VueConstructor;
    };

    export = VanillaComponent;
}

declare module "vanilla/es5/directives" {
    import { DirectiveOptions } from "vue";

    const ClickOutside: DirectiveOptions;
    const Intersect: DirectiveOptions;
    const Mutate: DirectiveOptions;
    const Resize: DirectiveOptions;
    const Ripple: DirectiveOptions;
    const Scroll: DirectiveOptions;
    const Touch: DirectiveOptions;

    export { ClickOutside, Intersect, Mutate, Ripple, Resize, Scroll, Touch };
}
