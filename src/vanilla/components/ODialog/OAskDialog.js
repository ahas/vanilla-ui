import Vue from "vue";
import ODialog from "./ODialog";
import OBtn from "../OBtn/OBtn";

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
        computedCancelColor() {
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
        computedOkColor() {
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
        genCardTitle() {
            return (
                (this.title || this.type) &&
                this.$createElement(OCardTitle, [
                    (this.title && this.$createElement("span", this.title)) ||
                        (this.type == "delete" && this.$createElement("span", this.$t("$vanilla.dialog.ask"))),
                ])
            );
        },
        genCardText() {
            return (
                (this.$slots.message || this.message) &&
                this.$createElement(
                    OCardText,
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
                )
            );
        },
        genCardActions() {
            return this.$createElement(OCardActions, [
                this.$createElement(OSpacer),
                !hideCancel &&
                    this.$createElement(
                        OBtn,
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
                        this.$t("$vanilla.ask-dialog.cancel"),
                    ),
                this.$createElement(
                    OBtn,
                    {
                        props: {
                            text: true,
                            depressed: true,
                            color: okColor,
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
        genOkText() {
            if (this.okText) {
                return this.$createElement("span", this.okText);
            } else if (this.type == "confirm") {
                return this.$createElement("span", this.$t("$vanilla.ask-dialog.confirm"));
            } else if (this.type == "delete") {
                return this.$createElement("span", this.$t("$vanilla.ask-dialog.delete"));
            }
        },
        genCard() {
            return this.$createElement(OCard, [
                this.genCardTitle(),
                (this.title || this.type) && (this.message || this.$slots.message) && this.$createElement(ODivider),
                this.genCardText(),
                this.$createElement(ODivider),
                this.genCardActions(),
            ]);
        },
    },
    render(h) {
        return h(
            ODialog,
            {
                props: {
                    value: this.value,
                    width: this.width,
                },
                attrs: this.$attrs,
                on: {
                    input: (e) => {
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
