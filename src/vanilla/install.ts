import OurVue, { VueConstructor } from "vue";
import { VanillaUseOptions } from "./types";
import { consoleError } from "./utils/console";

export function install(Vue: VueConstructor, args: VanillaUseOptions = {}) {
    if ((install as any).installed) return;
    (install as any).installed = true;

    if (OurVue !== Vue) {
        consoleError(`Multiple instances of Vue detected
See https://github.com/vanillajs/vanilla/issues/4068

If you're seeing "$attrs is readonly", it's caused by this`);
    }

    const components = args.components || {};
    const directives = args.directives || {};

    for (const name in directives) {
        const directive = directives[name];

        Vue.directive(name, directive);
    }

    (function registerComponents(components: any) {
        if (components) {
            for (const key in components) {
                const component = components[key];
                if (component && !registerComponents(component.$_vanilla_subcomponents)) {
                    Vue.component(key, component as typeof Vue);
                }
            }
            return true;
        }
        return false;
    })(components);

    // Used to avoid multiple mixins being setup
    // when in dev mode and hot module reload
    if (Vue.$_vanilla_installed) {
        return;
    }
    Vue.$_vanilla_installed = true;

    Vue.mixin({
        beforeCreate() {
            const options = this.$options as any;

            if (options.vanilla) {
                options.vanilla.init(this, this.$ssrContext);
                this.$vanilla = Vue.observable(options.vanilla.framework);
            } else {
                this.$vanilla = (options.parent && options.parent.$vanilla) || this;
            }
        },
        beforeMount() {
            // @ts-ignore
            if (this.$options.vanilla && this.$el && this.$el.hasAttribute("data-server-rendered")) {
                // @ts-ignore
                this.$vanilla.isHydrating = true;
                // @ts-ignore
                this.$vanilla.breakpoint.update(true);
            }
        },
        mounted() {
            // @ts-ignore
            if (this.$options.vanilla && this.$vanilla.isHydrating) {
                // @ts-ignore
                this.$vanilla.isHydrating = false;
                // @ts-ignore
                this.$vanilla.breakpoint.update();
            }
        },
    });
}
