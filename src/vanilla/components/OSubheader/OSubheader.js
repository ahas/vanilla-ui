import "./OSubheader.scss";
import Vue from "vue";

// Mixins
import Themeable from "../../mixins/themeable";

export default Vue.extend({
    name: "o-subheader",
    mixins: [Themeable],
    props: {
        inset: Boolean,
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-subheader",
                class: {
                    "o-subheader--inset": this.inset,
                    ...this.themeClasses,
                },
                attrs: this.$attrs,
                on: this.$listeners,
            },
            this.$slots.default,
        );
    },
});
