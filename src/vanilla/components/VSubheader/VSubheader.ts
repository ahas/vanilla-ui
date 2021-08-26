// Styles
import "./VSubheader.scss";

// Mixins
import Themeable from "../../mixins/themeable";
import mixins from "../../utils/mixins";

// Types
import { VNode } from "vue";

export default mixins(
    Themeable,
    /* @vue/component */
).extend({
    name: "v-subheader",
    props: {
        inset: Boolean,
    },
    render(h): VNode {
        return h(
            "div",
            {
                staticClass: "v-subheader",
                class: {
                    "v-subheader--inset": this.inset,
                    ...this.themeClasses,
                },
                attrs: this.$attrs,
                on: this.$listeners,
            },
            this.$slots.default,
        );
    },
});
