import Vue, { VNode, VNodeChildren } from "vue";

import { VCard, VCardActions, VCardText, VCardTitle } from "../VCard";
import VDialog from "../VDialog/VDialog";
import VSpacer from "../VGrid/VSpacer";
import VBtn from "./VBtn";

export default Vue.extend({
    props: {
        message: { type: String },
        text: { type: String },
        noAsk: { type: Boolean, default: false },
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        click(e: MouseEvent): void {
            if (this.noAsk) {
                this.$emit("accept", e);
            } else {
                this.dialog = true;
            }
            e.stopPropagation();
        },
        genCardButtons(): VNodeChildren {
            return [
                this.$createElement(VSpacer),
                this.$createElement(
                    VBtn,
                    {
                        props: {
                            color: "danger",
                        },
                        on: {
                            click: () => (this.dialog = false),
                        },
                    },
                    this.$vanilla.lang.t("$vanilla.btn-confirm.cancel"),
                ),
                this.$createElement(
                    VBtn,
                    {
                        props: {
                            color: "primary",
                        },
                        on: {
                            click: (e: MouseEvent) => {
                                this.dialog = false;
                                this.$emit("accept", e);
                            },
                        },
                    },
                    this.$vanilla.lang.t("$vanilla.btn-confirm.confirm"),
                ),
            ];
        },
        genCard(): VNode {
            return this.$createElement(VCard, [
                this.$createElement(VCardTitle, this.$vanilla.lang.t("$vanilla.btn-confirm.dialog.title")),
                this.$createElement(VCardText, this.$slots.message || this.message),
                this.$createElement(VCardActions, this.genCardButtons()),
            ]);
        },
        genDialog(): VNode {
            return this.$createElement(
                VDialog,
                {
                    props: {
                        width: 400,
                        value: this.dialog,
                    },
                    on: {
                        input: (dialog: boolean) => (dialog = this.dialog),
                    },
                },
                [this.genCard()],
            );
        },
    },
    render(h): VNode {
        return h("span", [
            this.$createElement(
                VBtn,
                {
                    attrs: this.$attrs,
                    props: {
                        color: this.$attrs.color,
                    },
                    on: {
                        ...this.$listeners,
                        click: this.click,
                    },
                },
                [this.$slots.default, (!this.noAsk && this.$slots.dialog) || this.genDialog()],
            ),
        ]);
    },
});
