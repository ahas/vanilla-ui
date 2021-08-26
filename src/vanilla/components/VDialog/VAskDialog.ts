import Vue, { VNode } from "vue";
import VDialog from "./VDialog";
import VDivider from "../VDivider/VDivider";
import VBtn from "../VBtn/VBtn";
import VSpacer from "../VGrid/VSpacer";
import { VCard, VCardTitle, VCardText, VCardActions } from "../VCard";

export default Vue.extend({
    props: {
        value: { validator: () => true },
        title: { type: String },
        type: { type: String },
        message: { type: String },
        width: { type: [Number, String], default: "400" },
        cancelText: { type: String },
        cancelColor: { type: String },
        okText: { type: String },
        okColor: { type: String },
        hideCancel: { type: Boolean, default: false },
    },
    computed: {
        computedCancelColor(): string | null {
            if (this.cancelColor) {
                return this.cancelColor;
            }

            switch (this.type) {
                case "delete":
                    return null;
                default:
                    return "error";
            }
        },
        computedOkColor(): string {
            if (this.okColor) {
                return this.okColor;
            }
            switch (this.type) {
                case "delete":
                    return "error";
                default:
                    return "primary";
            }
        },
    },
    methods: {
        genCardTitle(): VNode | "" {
            return (
                (this.title || this.type) &&
                this.$createElement(VCardTitle, [
                    (this.title && this.$createElement("span", this.title)) ||
                        (this.type == "delete" && this.$createElement("span", this.$vanilla.lang.t("$vanilla.dialog.ask"))),
                ])
            );
        },
        genCardText(): VNode {
            return ((this.$slots.message! || this.message) &&
                this.$createElement(
                    VCardText,
                    {
                        style: {
                            "overflow-wrap": "break-word",
                        },
                    },
                    [
                        !this.message
                            ? this.$createElement("slot", { attrs: { name: "message" } })
                            : this.$createElement(
                                  "div",
                                  {
                                      staticClass: ".pre-line",
                                  },
                                  this.message,
                              ),
                    ],
                ))!;
        },
        genCardActions(): VNode {
            return this.$createElement(VCardActions, [
                this.$createElement(VSpacer),
                !this.hideCancel &&
                    this.$createElement(
                        VBtn,
                        {
                            props: {
                                text: true,
                                depressed: true,
                                color: this.cancelColor,
                            },
                            on: {
                                click: () => {
                                    this.$emit("input", false);
                                    this.$emit("reject");
                                },
                            },
                        },
                        this.$vanilla.lang.t("$vanilla.ask-dialog.cancel"),
                    ),
                this.$createElement(
                    VBtn,
                    {
                        props: {
                            text: true,
                            depressed: true,
                            color: this.okColor,
                        },
                        on: {
                            click: () => {
                                this.$emit("input", false);
                                this.$emit("accept");
                            },
                        },
                    },
                    [this.genOkText()],
                ),
            ]);
        },
        genOkText(): VNode {
            if (this.okText) {
                return this.$createElement("span", this.okText);
            } else if (this.type == "confirm") {
                return this.$createElement("span", this.$vanilla.lang.t("$vanilla.ask-dialog.confirm"));
            } else if (this.type == "delete") {
                return this.$createElement("span", this.$vanilla.lang.t("$vanilla.ask-dialog.delete"));
            }
            return null as any;
        },
        genCard(): VNode {
            return this.$createElement(VCard, [
                this.genCardTitle(),
                (this.title || this.type) && (this.message || this.$slots.message) && this.$createElement(VDivider),
                this.genCardText(),
                this.$createElement(VDivider),
                this.genCardActions(),
            ]);
        },
    },
    render(h): VNode {
        return h(
            VDialog,
            {
                props: {
                    value: this.value,
                    width: this.width,
                },
                attrs: this.$attrs,
                on: {
                    input: (e: Event) => {
                        this.$emit("input", e);
                    },
                },
                style: {
                    "overflow-x": "hidden",
                },
                scopedSlots: {
                    activator: (scope) => {
                        return this.$createElement("slot", {
                            attrs: scope,
                        });
                    },
                },
            },
            [this.genCard()],
        );
    },
});
