import Vue from "vue";

// Components
import OBtn from "./OBtn";
import OIcon from "../OIcon/OIcon";
import ODialog from "../ODialog/ODialog";

export default Vue.extend({
    name: "OBtnDelete",
    props: {
        label: { type: String },
        message: { type: String },
        hideAsk: { type: Boolean, default: false },
        hideIcon: { type: Boolean, default: false },
        hideText: { type: Boolean, default: false },
        dark: { type: Boolean, default: false },
    },
    data() {
        return {
            dialog: false,
        };
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
                        "mdi-trash-can-outline",
                    ),
                    !this.hideText && !this.icon && this.$createElement("span", this.label || this.$t("$vanilla.btn-delete.label", "Delete")),
                ]);
            }
            return !this.hideIcon && !this.icon && this.$createElement("span", this.label || this.$t("$vanilla.btn-delete.label", "Delete"));
        },
        genDialog() {
            if (!this.hideAsk) {
                return this.$createElement(ODialog, {
                    props: {
                        value: this.dialog,
                        type: "delete",
                        message: "message",
                    },
                    on: {
                        input: (dialog) => {
                            this.dialog = dialog;
                        },
                        accept: () => this.$emit("accept"),
                    },
                });
            }
            return null;
        },
        onClick(e) {
            if (this.hideAsk) {
                this.$emit("accept", e);
            } else {
                this.dialog = true;
            }
        },
    },
    render(h) {
        return h("span", [
            this.$createElement(
                OBtn,
                {
                    attrs: this.$attrs,
                    props: {
                        color: this.$attrs.color,
                        icon: this.icon,
                        color: this.dark ? "white" : "error",
                    },
                    on: {
                        ...this.$listeners,
                        click: (e) => {
                            this.onClick();
                            e.stopPropagation();
                        },
                    },
                },
                [this.genLabel(), this.genDialog()],
            ),
        ]);
    },
});
