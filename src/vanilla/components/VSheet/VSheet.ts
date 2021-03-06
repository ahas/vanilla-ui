import "./VSheet.scss";

// Mixins
import BindsAttrs from "../../mixins/binds-attrs";
import Colorable from "../../mixins/colorable";
import Elevatable from "../../mixins/elevatable";
import Measurable from "../../mixins/measurable";
import Roundable from "../../mixins/roundable";
import Themeable from "../../mixins/themeable";

// Utilities
import mixins from "../../utils/mixins";

// Types
import { VNode } from "vue/types";

export default mixins(BindsAttrs, Colorable, Elevatable, Measurable, Roundable, Themeable).extend({
    name: "v-sheet",
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
        classes(): object {
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
        styles(): object {
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
