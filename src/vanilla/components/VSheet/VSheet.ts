import "./VSheet.scss";

// Mixins
import BindsAttrs from "@/vanilla/mixins/binds-attrs";
import Colorable from "@/vanilla/mixins/colorable";
import Elevatable from "@/vanilla/mixins/elevatable";
import Measurable from "@/vanilla/mixins/measurable";
import Roundable from "@/vanilla/mixins/roundable";
import Themeable from "@/vanilla/mixins/themeable";

// Utilities
import mixins from "@/vanilla/utils/mixins";

// Types
import { VNode } from "vue/types/umd";

export default mixins(BindsAttrs, Colorable, Elevatable, Measurable, Roundable, Themeable).extend({
    name: "VSheet",
    props: {
        outlined: Boolean,
        shaped: Boolean,
        dashed: Boolean,
        centered: Boolean,
        tag: {
            type: String,
            default: "div",
        },
    },
    computed: {
        classes() {
            return {
                "v-sheet": true,
                "v-sheet--outlined": this.outlined,
                "v-sheet--shaped": this.shaped,
                "v-sheet--dashed": this.dashed,
                "text-center": this.centered,
                ...this.themeClasses,
                ...this.elevationClasses,
                ...this.roundedClasses,
            };
        },
        styles() {
            return this.measurableStyles;
        },
    },
    render(h): VNode {
        const data = {
            class: this.classes,
            style: this.styles,
            on: this.listeners$,
        };

        return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});
