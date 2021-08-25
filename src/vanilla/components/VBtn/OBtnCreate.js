import Vue from "vue";

// Components
import OBtn from "./OBtn";
import OIcon from "../OIcon/OIcon";

export default Vue.extend({
    name: "OBtnCreate",
    props: {
        label: { type: String },
        hideIcon: { type: Boolean, default: false },
        hideText: { type: Boolean, default: false },
        dark: { type: Boolean, default: false },
    },
    methods: {
        genLabel() {
            if (!this.hideIcon) {
                return this.$createElement("div", [
                    this.$createElement(
                        OIcon,
                        {
                            props: {
                                left: !this.icon && !this.hideText,
                                dark: !this.dark,
                            },
                        },
                        "mdi-plus",
                    ),
                    !this.hideText && !this.icon && this.$createElement("span", this.label || this.$t("$vanilla.btn-create.label", "New Item")),
                ]);
            }
            return !this.hideIcon && !this.icon && this.$createElement("span", this.label || this.$t("$vanilla.btn-create.label", "New Item"));
        },
    },
    render(h) {
        return h(
            OBtn,
            {
                attrs: this.$attrs,
                props: {
                    color: this.$attrs.color,
                    icon: this.icon,
                    color: this.dark ? "white" : "primary",
                },
                on: {
                    ...this.$listeners,
                },
            },
            [this.genLabel()],
        );
    },
});
