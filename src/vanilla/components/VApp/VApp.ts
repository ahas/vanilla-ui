import "./VApp.scss";

import { VNode } from "vue";

// Utilities
import mixins from "../../utils/mixins";

// Mixins
import Themeable from "../../mixins/themeable";

/* @vue/component */
export default mixins(Themeable).extend({
    name: "v-app",
    props: {
        backgroundColor: { type: String, default: "#fafafa" },
        dark: {
            type: Boolean,
            default: undefined,
        },
        fill: { type: Boolean },
        id: { type: String, default: "app" },
        light: {
            type: Boolean,
            default: undefined,
        },
    },
    computed: {
        classes(): Dictionary<any> {
            return {
                rtl: this.$vanilla.rtl,
                ltr: !this.$vanilla.rtl,
                ...this.themeClasses,
            };
        },
        styles(): Dictionary<any> {
            return {
                "min-width": this.fill ? "100vw" : "auto",
                "min-height": this.fill ? "100vh" : "auto",
                "background-color": this.backgroundColor,
            };
        },
        isDark(): boolean {
            return this.$vanilla.theme.dark;
        },
    },
    beforeCreate() {
        if (!this.$vanilla || this.$vanilla === (this.$root as any)) {
            throw new Error("Vanilla is not properly initialized");
        }
    },
    render(h): VNode {
        const wrapper = h("div", { staticClass: "o-app--wrap" }, this.$slots.default);

        return h(
            "div",
            {
                staticClass: "o-app",
                class: {
                    "o-app--is-rtl": this.$vanilla.rtl,
                    "o-app--is-ltr": !this.$vanilla.rtl,
                    ...this.themeClasses,
                },
                attrs: { "data-app": true },
                domProps: { id: this.id },
            },
            [wrapper],
        );
    },
});
