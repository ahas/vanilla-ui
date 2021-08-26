import { PropType } from "vue";

// Utilities
import path from "path";
import multipart from "./utils/multipart";
import axios from "axios";

// Mixins
import mixins from "../../utils/mixins";
import BindsAttrs from "../../mixins/binds-attrs";
import { provide as RegistrableProvide } from "../../mixins/registrable";

// Components
import VProgress from "../VProgress/VProgress";

// Types
import { VNode } from "vue";
import { VInput } from "../VInput";

type RequestMethod = "get" | "post" | "put" | "delete";
type ErrorBag = Record<number, boolean>;
type VInputInstance = InstanceType<typeof VInput>;
type Watchers = {
    _uid: number;
    valid: () => void;
    shouldValidate: () => void;
};

const BaseMixins = mixins(BindsAttrs, RegistrableProvide("form"));

/* @vue/component */
export default BaseMixins.extend({
    name: "VForm",
    props: {
        action: { type: String },
        modelId: { type: String, default: "id" },
        name: { type: String },
        path: { type: String },
        value: {} as PropType<any>,
        process: Function as PropType<(v: any) => any>,
        method: { type: String, default: null },
        redirect: { type: [String, Function], default: null },
        catch: { type: Object as PropType<any>, default: null },
        loading: { type: Boolean, default: false },
        sending: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        successMsg: { type: String },
        multipart: { type: Boolean, default: false },
        validation: Function,
        lazyValidation: Boolean,
        showLoader: { type: Boolean, default: false },
        labelCols: { type: [String, Number], validate: (cols: string | number) => !isNaN(+cols) },
    },
    provide(): object {
        return { form: this };
    },
    data() {
        return {
            valid: true,
            saved: false,
            submitError: "",
            props: {
                sending: this.sending,
            },
            inputs: [] as VInputInstance[],
            watchers: [] as Watchers[],
            errorBag: {} as ErrorBag,
        };
    },
    computed: {
        hasCancelListener(): boolean {
            return !!(this.$listeners && this.$listeners.cancel);
        },
        actionUrl(): string {
            if (this.currentMethod == "put" && this.name && this.modelId) {
                return path.join(this.action || "/", String(this.value[this.name][this.modelId]));
            }
            return this.action;
        },
        currentMethod(): RequestMethod {
            if (this.method) {
                return this.method.toLowerCase() as RequestMethod;
            }
            return this.name && this.modelId && this.value?.[this.name]?.[this.modelId] ? "put" : "post";
        },
        isSending(): boolean {
            return this.props.sending || this.sending;
        },
        computedDisabled(): boolean {
            return this.disabled || this.loading || this.props.sending;
        },
        computedLoading(): boolean {
            return this.showLoader && (this.loading || this.sending);
        },
    },
    watch: {
        "props.sending": {
            handler(val) {
                this.$emit("update:sending", val);
            },
        },
        errorBag: {
            handler(val) {
                const errors = Object.values(val).includes(true);

                this.$emit("input", !errors);
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        watchInput(input: any): Watchers {
            const watcher = (input: any): (() => void) => {
                return input.$watch(
                    "hasError",
                    (val: boolean) => {
                        this.$set(this.errorBag, input._uid, val);
                    },
                    { immediate: true },
                );
            };

            const watchers: Watchers = {
                _uid: input._uid,
                valid: () => {},
                shouldValidate: () => {},
            };

            if (this.lazyValidation) {
                // Only start watching inputs if we need to
                watchers.shouldValidate = input.$watch("shouldValidate", (val: boolean) => {
                    if (!val) return;

                    // Only watch if we're not already doing it
                    if (this.errorBag.hasOwnProperty(input._uid)) return;

                    watchers.valid = watcher(input);
                });
            } else {
                watchers.valid = watcher(input);
            }

            return watchers;
        },
        async trySubmit(): Promise<any> {
            let body = this.process ? await this.process(this.value) : this.value;
            if (this.multipart) {
                body = multipart(body);
            }
            const response = await axios[this.currentMethod](this.actionUrl, body, {
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
        async catchError(e: Error): Promise<void> {
            this.$emit("error", e);
        },
        validate(): boolean {
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
        submit(): Promise<void> {
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
                    return true;
                });
            });
        },
        reset(): void {
            this.inputs.forEach((input) => input.reset());
            this.resetErrorBag();
        },
        resetErrorBag(): void {
            if (this.lazyValidation) {
                // Account for timeout in validatable
                setTimeout(() => {
                    this.errorBag = {};
                }, 0);
            }
        },
        resetValidation(): void {
            this.inputs.forEach((input) => input.resetValidation());
            this.resetErrorBag();
        },
        register(input: VInputInstance): void {
            this.inputs.push(input);
            this.watchers.push(this.watchInput(input));
        },
        unregister(input: VInputInstance): void {
            const found = this.inputs.find((i) => i._uid === input._uid);
            if (!found) {
                return;
            }
            this.inputs = this.inputs.filter((i) => i._uid !== found._uid);
        },
        onSubmit(): void {
            this.inputs.forEach((input) => input.onSubmit?.());
        },
        onEnded(): void {
            this.inputs.forEach((input) => input.onEnded?.());
        },
        onProgress(e: Event): void {
            this.inputs.forEach((input) => input.notifyUploadProgress?.(e));
        },
        // Slots
        genLoader(): VNode {
            return this.$createElement("template", [
                this.$slots.loader ||
                    this.$createElement(
                        "div",
                        {
                            staticClass: "v-form__loader",
                        },
                        [
                            this.$createElement(VProgress, {
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
        genContent(): VNode[] | undefined {
            return this.$slots.default;
        },
    },
    mounted() {
        this.$emit("ready");
    },
    render(h): VNode {
        return h(
            "form",
            {
                ref: "form",
                staticClass: "v-form",
                attrs: {
                    readonly: this.readonly,
                    disabled: this.disabled,
                },
                on: {
                    submit: (e: Event) => this.$emit("submit", e),
                },
            },
            [this.computedLoading && this.genLoader(), this.genContent()],
        );
    },
});
