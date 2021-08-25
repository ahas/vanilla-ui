import "./OMessages.scss";
import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";

// Utils
import { getSlot } from "../../utils/helpers";

/* @vue/component */
export default Vue.extend({
    name: "OMessages",
    mixins: [Colorable, Themeable],
    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        genChildren() {
            return this.$createElement(
                "transition-group",
                {
                    staticClass: "o-messages__wrapper",
                    attrs: {
                        name: "message-transition",
                        tag: "div",
                    },
                },
                this.value.map(this.genMessage),
            );
        },
        genMessage(message, key) {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-messages__message",
                    key,
                },
                getSlot(this, "default", { message, key }) || [message],
            );
        },
    },
    render(h) {
        return h(
            "div",
            this.setTextColor(this.color, {
                staticClass: "o-messages",
                class: this.themeClasses,
            }),
            [this.genChildren()],
        );
    },
});
