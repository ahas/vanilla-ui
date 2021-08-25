import Vue from "vue";

import { OCard, OCardActions, OCardText, OCardTitle } from "../OCard";
import ODialog from "../ODialog/ODialog";
import OSpacer from "../OGrid/OSpacer";
import OBtn from "./OBtn";

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
        click(e) {
            if (this.noAsk) {
                this.$emit("accept", e);
            } else {
                this.dialog = true;
            }
            e.stopPropagation();
        },
        genCardButtons() {
            return [
                this.$createElement(OSpacer),
                this.$createElement(
                    OBtn,
                    {
                        props: {
                            color: "danger",
                        },
                        on: {
                            click: () => (this.dialog = false),
                        },
                    },
                    this.$t("$vanilla.btn-confirm.cancel"),
                ),
                this.$createElement(
                    OBtn,
                    {
                        props: {
                            color: "primary",
                        },
                        on: {
                            click: (e) => {
                                this.dialog = false;
                                this.$emit("accept", e);
                            },
                        },
                    },
                    this.$t("$vanilla.btn-confirm.confirm"),
                ),
            ];
        },
        genCard() {
            return this.$createElement(OCard, [
                this.$createElement(OCardTitle, this.$t("$vanilla.btn-confirm.dialog.title")),
                this.$createElement(OCardText, this.$slots.message || this.message),
                this.$createElement(OCardActions, this.genCardButtons()),
            ]);
        },
        genDialog() {
            return this.$createElement(
                ODialog,
                {
                    props: {
                        width: 400,
                        value: this.dialog,
                    },
                    on: {
                        input: (dialog) => (dialog = this.dialog),
                    },
                },
                [this.genCard()],
            );
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
