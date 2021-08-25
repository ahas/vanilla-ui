import "./OAvatar.scss";
import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import Measurable from "../../mixins/measurable";
import Roundable from "../../mixins/roundable";

// Utils
import { convertToUnit } from "../../utils/helpers";

export default Vue.extend({
    name: "OAvatar",
    mixins: [Colorable, Measurable, Roundable],
    props: {
        left: Boolean,
        right: Boolean,
        size: {
            type: [Number, String],
            default: 48,
        },
    },
    computed: {
        classes() {
            return {
                "o-avatar--left": this.left,
                "o-avatar--right": this.right,
                ...this.roundedClasses,
            };
        },
        styles() {
            return {
                height: convertToUnit(this.size),
                minWidth: convertToUnit(this.size),
                width: convertToUnit(this.size),
                ...this.measurableStyles,
            };
        },
    },
    render(h) {
        const data = {
            staticClass: "o-avatar",
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        };

        return h("div", this.setBackgroundColor(this.color, data), this.$slots.default);
    },
});
