import "./VMessages.scss";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";

// Utilities
import { getSlot } from "../../utils/helpers";
import mixins from "../../utils/mixins";

// Types
import { VNode } from "vue";
import { PropValidator } from "vue/types/options";

const BaseMixins = mixins(Colorable, Themeable);

/* @vue/component */
export default BaseMixins.extend({
    name: "v-messages",
    props: {
        value: {
            type: Array,
            default: () => [],
        } as PropValidator<string[]>,
    },
    methods: {
        genChildren(): VNode {
            return this.$createElement(
                "transition-group",
                {
                    staticClass: "v-messages__wrapper",
                    attrs: {
                        name: "message-transition",
                        tag: "div",
                    },
                },
                this.value.map(this.genMessage),
            );
        },
        genMessage(message: string, key: number) {
            return this.$createElement(
                "div",
                {
                    staticClass: "v-messages__message",
                    key,
                },
                getSlot(this, "default", { message, key }) || [message],
            );
        },
    },
    render(h): VNode {
        return h(
            "div",
            this.setTextColor(this.color, {
                staticClass: "v-messages",
                class: this.themeClasses,
            }),
            [this.genChildren()],
        );
    },
});
