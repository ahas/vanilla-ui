import Vue from "vue";

import path from "path";

import multipart from "@oven/lib/multipart";

// Components
import OSnackbar from "../OSnackbar/OSnackbar";
import OProgress from "../OProgress/OProgress";

export default Vue.extend({
    name: "OForm",
    props: {
        action: { type: String },
        modelId: { type: String, default: "id" },
        name: { type: String },
        path: { type: String },
        value: {},
        process: { type: Function },
        method: { type: String, default: null },
        redirect: { type: [String, Function], default: null },
        catch: { type: Object, default: null },
        loading: { type: Boolean, default: false },
        sending: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        successMsg: { type: String },
        multipart: { type: Boolean, default: false },
        hideDetails: { type: Boolean, default: false },
        hideSuccess: { type: Boolean, default: false },
        hideError: { type: Boolean, default: false },
        validation: { type: Function },
        showLoader: { type: Boolean, default: false },
        labelCols: { type: [String, Number], validate: (cols) => !isNaN(+cols) },
    },
    provide() {
        return { oform: this };
    },
    data() {
        return {
            valid: true,
            saved: false,
            showSubmitError: false,
            submitError: "",
            props: {
                sending: this.sending,
            },
            inputs: [],
        };
    },
    watch: {
        "props.sending": {
            handler(val) {
                this.$emit("update:sending", val);
            },
        },
    },
    computed: {
        hasCancelListener() {
            return this.$listeners && this.$listeners.cancel;
        },
        actionUrl() {
            if (this.currentMethod == "put" && this.name && this.modelId) {
                return path.join(this.action || "/", String(this.value[this.name][this.modelId]));
            }
            return this.action;
        },
        currentMethod() {
            if (this.method) {
                return this.method.toLowerCase();
            }
            return this.name && this.modelId && this.value?.[this.name]?.[this.modelId] ? "put" : "post";
        },
        issending() {
            return this.props.sending || this.sending;
        },
        computedDisabled() {
            return this.disabled || this.loading || this.props.sending;
        },
        computedLoading() {
            return this.showLoader && (this.loading || this.sending);
        },
    },
    methods: {
        async trySubmit() {
            let body = this.process ? await this.process(this.value) : this.value;
            if (this.multipart) {
                body = multipart(body);
            }
            const response = await this.$axios[this.currentMethod](this.actionUrl, body, {
                onUploadProgress: (e) => {
                    this.onProgress(e);
                },
            });
            const data = response ? response.data : null;
            if (this.name && this.modelId && data && data[this.modelId]) {
                this.$set(this.value[this.name], this.modelId, data[this.modelId]);
            }
            this.$emit("success", data);
            if (this.redirect) {
                if (typeof this.redirect === "function") {
                    this.$router.push(this.redirect(data));
                } else {
                    this.$router.push(this.redirect);
                }
            }
            return data;
        },
        async catchError(e) {
            if (this.catch) {
                this.submitError = this.catch[e.response.status] || this.catch.default || (this.$store.state.oven.dev ? e.stack : e.message);
            } else {
                this.submitError = this.$store.state.oven.dev ? e.stack : e.message;
            }
            this.$emit("error", e);
            this.showSubmitError = true;
        },
        validate() {
            let scrolled = false;
            for (const input of this.inputs) {
                const valid = input.validate(true);
                if (!scrolled && !valid) {
                    const el = input.$el || input;
                    const y = el.getBoundingClientRect().top + window.scrollY - el.clientHeight;
                    window.scroll({
                        top: y,
                        behavior: "smooth",
                    });
                    scrolled = true;
                }
            }
            return !scrolled;
        },
        submit() {
            let hasError = false;
            return new Promise((resolve, reject) => {
                this.$nextTick(async () => {
                    if (!this.validate()) {
                        return false;
                    }
                    this.onSubmit();
                    this.$emit("submit");
                    this.props.sending = true;
                    try {
                        const data = await this.trySubmit();
                        resolve(data);
                    } catch (e) {
                        hasError = true;
                        this.catchError(e);
                        if (!this.catch && !this.$listeners.error) {
                            reject(e);
                        } else {
                            resolve();
                        }
                    } finally {
                        if (!hasError) {
                            this.saved = true;
                        }
                        this.props.sending = false;
                    }
                    this.onEnded();
                    this.$emit("end");
                });
            });
        },
        reset() {
            this.$refs.form.reset();
        },
        resetValidation() {
            this.$refs.form.resetValidation();
        },
        register(input) {
            this.inputs.push(input);
        },
        unregister(input) {
            const found = this.inputs.find((i) => i._uid === input._uid);
            if (!found) {
                return;
            }
            this.inputs = this.inputs.filter((i) => i._uid !== found._uid);
        },
        onSubmit() {
            this.inputs.forEach((input) => input.onSubmit?.());
        },
        onEnded() {
            this.inputs.forEach((input) => input.onEnded?.());
        },
        onProgress(e) {
            this.inputs.forEach((input) => input.notifyUploadProgress?.(e));
        },
        // Slots
        genLoader() {
            return this.$createElement("template", [
                this.$slots.loader ||
                    this.$createElement(
                        "div",
                        {
                            staticClass: "o-form__loader",
                        },
                        [
                            this.$createElement(OProgress, {
                                props: {
                                    type: "circle",
                                    color: "primary",
                                    size: "128",
                                    indeterminate: true,
                                    absolute: true,
                                    centered: true,
                                },
                            }),
                        ],
                    ),
            ]);
        },
        genContent() {
            return this.$slots.default;
        },
        genAlerts() {
            if (!this.hideDetails) {
                return [
                    !this.hideSuccess &&
                        this.$createElement(
                            OSnackbar,
                            {
                                props: {
                                    app: true,
                                    bottom: true,
                                    color: "success",
                                    value: this.saved,
                                    timeout: 3000,
                                },
                                on: {
                                    input: (v) => {
                                        this.saved = v;
                                    },
                                },
                            },
                            [this.$slots.success || this.successMsg || this.$t?.("$vanilla.form.changes-saved")],
                        ),
                    !this.hideError &&
                        this.$createElement(
                            OSnackbar,
                            {
                                props: {
                                    app: true,
                                    bottom: true,
                                    color: "error",
                                    value: this.showSubmitError,
                                    timeout: 3000,
                                },
                                on: {
                                    input: (v) => {
                                        this.showSubmitError = v;
                                    },
                                },
                            },
                            [this.$slots.error || this.submitError],
                        ),
                ];
            }
            return null;
        },
    },
    mounted() {
        this.$emit("ready");
    },
    render(h) {
        return h(
            "form",
            {
                ref: "form",
                staticClass: "o-form",
                attrs: {
                    readonly: this.readonly,
                    disabled: this.disabled,
                },
                on: {
                    submit: (e) => {
                        this.submit();
                        e.preventDefault();
                    },
                },
            },
            [
                this.computedLoading && this.genLoader(), //
                this.genContent(),
                this.genAlerts(),
            ],
        );
    },
});
