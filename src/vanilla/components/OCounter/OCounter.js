import "./OCounter.scss";
import Vue from "vue";

// Mixins
import Themeable, { functionalThemeClasses } from "../../mixins/themeable";

/* @vue/component */
export default Vue.extend({
    name: "OCounter",
    mixins: [Themeable],
    functional: true,
    props: {
        value: {
            type: [Number, String],
            default: "",
        },
        max: [Number, String],
    },
    render(h, ctx) {
        const { props } = ctx;
        const max = parseInt(props.max, 10);
        const value = parseInt(props.value, 10);
        const content = max ? `${value} / ${max}` : String(props.value);
        const isGreater = max && value > max;

        return h(
            "div",
            {
                staticClass: "o-counter",
                class: {
                    "error--text": isGreater,
                    ...functionalThemeClasses(ctx),
                },
            },
            content,
        );
    },
});
