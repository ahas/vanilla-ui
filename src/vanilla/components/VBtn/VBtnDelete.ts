import Vue, { VNode } from "vue";

// Components
import VBtn from "./VBtn";
import VIcon from "../VIcon/VIcon";
import VDialog from "../VDialog/VDialog";

export default Vue.extend({
    name: "v-btn-delete",
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
        genLabel(): VNode {
            if (!this.hideIcon) {
                return this.$createElement("div", [
                    this.$createElement(
                        VIcon,
                        {
                            props: {
                                left: !this.$attrs.icon && !this.hideText,
                                dark: !this.dark,
                            },
                        },
                        "mdi-trash-can-outline",
                    ),
                    !this.hideText &&
                        !this.$attrs.icon &&
                        this.$createElement("span", this.label || this.$vanilla.lang.t("$vanilla.btn-delete.label", "Delete")),
                ]);
            }
            return null as any;
        },
        genDialog(): VNode {
            if (!this.hideAsk) {
                return this.$createElement(VDialog, {
                    props: {
                        value: this.dialog,
                        type: "delete",
                        message: "message",
                    },
                    on: {
                        input: (dialog: boolean) => {
                            this.dialog = dialog;
                        },
                        accept: () => this.$emit("accept"),
                    },
                });
            }
            return null as any;
        },
        onClick(e: MouseEvent): void {
            if (this.hideAsk) {
                this.$emit("accept", e);
            } else {
                this.dialog = true;
            }
        },
    },
    render(h): VNode {
        return h("span", [
            this.$createElement(
                VBtn,
                {
                    attrs: this.$attrs,
                    on: {
                        ...this.$listeners,
                        click: (e: MouseEvent) => {
                            this.onClick(e);
                            e.stopPropagation();
                        },
                    },
                },
                [this.genLabel(), this.genDialog()],
            ),
        ]);
    },
});
