import Vue, { VNode } from "vue";

// Components
import VBtn from "./VBtn";

// Utilities
import { remapInternalIcon } from "../../utils/helpers";

export default Vue.extend({
    name: "v-btn-create",
    props: {
        label: { type: String },
        hideIcon: { type: Boolean, default: false },
        hideText: { type: Boolean, default: false },
        dark: { type: Boolean, default: false },
    },
    methods: {
        genLabel(): VNode {
            if (!this.hideIcon) {
                return this.$createElement("div", [
                    this.$createElement(remapInternalIcon(this, "plus"), {
                        props: {
                            left: !this.$attrs.icon && !this.$attrs.hideText,
                            dark: !this.$attrs.dark,
                        },
                    }),
                    !this.hideText &&
                        !this.$attrs.icon &&
                        this.$createElement("span", this.label || this.$vanilla.lang.t("$vanilla.btn-create.label", "New Item")),
                ]);
            }
            return null as any;
        },
    },
    render(h): VNode {
        return h(
            VBtn,
            {
                attrs: this.$attrs,
                props: {
                    color: this.$attrs.color,
                    icon: this.$attrs.icon,
                },
                on: {
                    ...this.$listeners,
                },
            },
            [this.genLabel()],
        );
    },
});
