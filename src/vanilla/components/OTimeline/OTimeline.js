// Styles
import "./OTimeline.scss";

// Mixins
import Themeable from "../../mixins/themeable";

export default Vue.extend({
    name: "OTimeline",
    mixins: [Themeable],
    provide() {
        return { timeline: this };
    },
    props: {
        alignTop: Boolean,
        dense: Boolean,
        reverse: Boolean,
    },
    computed: {
        classes() {
            return {
                "o-timeline--align-top": this.alignTop,
                "o-timeline--dense": this.dense,
                "o-timeline--reverse": this.reverse,
                ...this.themeClasses,
            };
        },
    },

    render(h) {
        return h(
            "div",
            {
                staticClass: "o-timeline",
                class: this.classes,
            },
            this.$slots.default,
        );
    },
});
