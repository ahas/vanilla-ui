import Vue from "vue";

// Mixins
import Validatable from "../../mixins/validatable";

// Components
import VBtn from "./VBtn";
import VIcon from "../VIcon/VIcon";
import { ORow, OCol, OSpacer } from "../VGrid";

export default Vue.extend({
    mixins: [Validatable],
    props: {
        left: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        hideCancel: { type: Boolean, default: false },
        hideIcons: { type: Boolean, default: false },
        hideCancelIcon: { type: Boolean, default: false },
        hideSubmitIcon: { type: Boolean, default: false },
        block: { type: Boolean, default: false },
        postText: { type: String },
        putText: { type: String },
        submitText: { type: String },
        cancelText: { type: String },
        postIcon: { type: String },
        putIcon: { type: String },
        submitIcon: { type: String },
        cancelIcon: { type: String },
        loading: { type: Boolean },
        submitColor: { type: String, default: "primary" },
        cancelColor: { type: String, default: "error" },
    },
    data() {
        return {
            props: {
                disabled: this.disabled,
                loading: this.loading,
            },
        };
    },
    computed: {
        isNew() {
            return this.method ? this.method.toUpperCase() == "POST" : true;
        },
        method() {
            return this.vform ? this.vform.currentMethod : "POST";
        },
    },
    watch: {
        loading(loading) {
            this.props.loading = loading;
        },
        disabled(disabled) {
            this.props.disabled = disabled;
        },
        "props.loading"(loading) {
            this.$emit("update:loading", loading);
        },
        "props.disabled"(disabled) {
            this.$emit("update:disabled", disabled);
        },
    },
    methods: {
        onSubmit() {
            this.props.loading = true;
        },
        onEnded() {
            this.props.loading = false;
        },
    },
    render(h) {
        return (
            this.vform &&
            !this.vform.readonly &&
            h(
                ORow,
                {
                    props: {
                        justify: "end",
                        space: 1,
                    },
                },
                [
                    !this.left && this.$createElement(OSpacer),
                    !this.block &&
                        !this.hideCancel &&
                        this.$createElement(
                            OCol,
                            {
                                props: {
                                    cols: "auto",
                                },
                            },
                            [
                                !this.hideCancel &&
                                    this.$createElement(
                                        OBtn,
                                        {
                                            attrs: this.$attrs,
                                            props: {
                                                dark: true,
                                                block: this.block,
                                                color: this.cancelColor,
                                                disabled: this.props.disabled || this.props.loading,
                                            },
                                            on: {
                                                click: () => this.$emit("cancel"),
                                            },
                                        },
                                        [
                                            !this.hideIcons &&
                                                !this.hideCancelIcon &&
                                                this.cancelIcon &&
                                                this.$createElement(
                                                    OIcon,
                                                    {
                                                        props: { left: true },
                                                    },
                                                    this.cancelIcon,
                                                ),
                                            this.cancelText || this.$t("$vanilla.btn-form.cancel"),
                                        ],
                                    ),
                            ],
                        ),
                    this.$createElement(
                        OCol,
                        {
                            props: {
                                cols: this.block ? 12 : "auto",
                            },
                        },
                        [
                            this.$createElement(
                                OBtn,
                                {
                                    attrs: this.$attrs,
                                    props: {
                                        block: this.block,
                                        color: this.submitColor,
                                        dark: true,
                                        type: "submit",
                                        loading: this.props.loading,
                                        disabled: this.props.disabled || this.props.loading || this.vform?.disabled,
                                    },
                                },
                                [
                                    !this.hideIcons &&
                                        !this.hideSubmitIcon &&
                                        this.$createElement(
                                            OIcon,
                                            {
                                                props: {
                                                    left: true,
                                                },
                                            },
                                            !!this.submitIcon
                                                ? this.submitIcon
                                                : this.isNew
                                                ? this.postIcon || "mdi-pencil"
                                                : this.putIcon || "mdi-content-save",
                                        ),
                                    !!this.submitText
                                        ? this.submitText
                                        : this.isNew
                                        ? this.postText || this.$t("$vanilla.btn-form.create")
                                        : this.putText || this.$t("$vanilla.btn-form.save-changes"),
                                ],
                            ),
                        ],
                    ),
                ],
            )
        );
    },
});
