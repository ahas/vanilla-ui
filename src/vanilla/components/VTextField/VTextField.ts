import "./VTextField.scss";

// Directives
import resize from "../../directives/resize";
import ripple from "../../directives/ripple";
// Mixins
import Intersectable from "../../mixins/intersectable";
import Loadable from "../../mixins/loadable";
import Validatable from "../../mixins/validatable";
import { breaking } from "../../utils/console";

// Utilities
import { attachedRoot } from "../../utils/dom";
import { convertToUnit } from "../../utils/helpers";

// Components
import { VCounter } from "../VCounter";

// Extensions
import { VInput } from "../VInput";

// Types
import mixins from "../../utils/mixins";
import { PropType } from "vue";

const BaseMixins = mixins(
    VInput,
    Intersectable({
        onVisible: ["onResize", "tryAutofocus"],
    }),
    Loadable,
);
interface options extends InstanceType<typeof BaseMixins> {
    $refs: {
        label: HTMLElement;
        input: HTMLInputElement;
        "prepend-inner": HTMLElement;
        prefix: HTMLElement;
        suffix: HTMLElement;
    };
}

/* @vue/component */
export default BaseMixins.extend<options>().extend({
    name: "OTextField",
    directives: {
        resize,
        ripple,
    },
    inheritAttrs: false,
    props: {
        appendOuterIcon: String,
        autofocus: Boolean,
        clearable: Boolean,
        clearIcon: {
            type: String,
            default: "$clear",
        },
        counter: [Boolean, Number, String],
        counterValue: Function as PropType<(value: any) => number>,
        maxLength: [Boolean, Number, String],
        length: Function,
        fullWidth: Boolean,
        outlined: Boolean,
        placeholder: String,
        prefix: String,
        prependInnerIcon: String,
        reverse: Boolean,
        singleLine: Boolean,
        suffix: String,
        type: {
            type: String,
            default: "text",
        },
    },
    data: () => ({
        badInput: false,
        prefixWidth: 0,
        prependWidth: 0,
        initialValue: null,
        isBooted: false,
        isClearing: false,
    }),
    computed: {
        classes(): object {
            return {
                ...VInput.options.computed.classes.call(this),
                "v-text-field": true,
                "v-text-field--full-width": this.fullWidth,
                "v-text-field--prefix": this.prefix,
                "v-text-field--is-booted": this.isBooted,
                "v-text-field--reverse": this.reverse,
                "v-text-field--placeholder": this.placeholder,
            };
        },
        computedColor(): string | undefined {
            const computedColor = Validatable.options.computed.computedColor.call(this);

            if (!this.isFocused) {
                return computedColor;
            }

            return this.color || "primary";
        },
        computedCounterValue(): number {
            if (typeof this.length === "function") {
                return this.length(this.internalValue);
            }
            return [...(this.internalValue || "").toString()].length;
        },
        hasCounter(): boolean {
            return this.maxLength !== false && this.maxLength != null;
        },
        hasDetails(): boolean {
            return VInput.options.computed.hasDetails.call(this) || this.hasCounter;
        },
        internalValue: {
            get(): any {
                return this.lazyValue;
            },
            set(val: any) {
                this.lazyValue = val;
                this.$emit("input", this.lazyValue);
            },
        },
        isDirty(): boolean {
            return this.lazyValue?.toString().length > 0 || this.badInput;
        },
        isSingle(): boolean {
            return (
                this.singleLine || this.fullWidth
                // https://material.io/components/text-fields/#filled-text-field
            );
        },
    },
    watch: {
        prefix() {
            this.$nextTick(this.setPrefixWidth);
        },
        isFocused: "updateValue",
        value(val) {
            this.lazyValue = val;
        },
    },
    created() {
        if (this.$attrs.hasOwnProperty("box")) {
            breaking("box", "filled", this);
        }

        if (this.$attrs.hasOwnProperty("browser-autocomplete")) {
            breaking("browser-autocomplete", "autocomplete", this);
        }
    },
    mounted() {
        // #11533
        this.autofocus && this.tryAutofocus();
        requestAnimationFrame(() => (this.isBooted = true));
    },
    methods: {
        focus() {
            this.onFocus();
        },
        blur(e?: Event) {
            // https://github.com/vuetifyjs/vuetify/issues/5913
            // Safari tab order gets broken if called synchronous
            window.requestAnimationFrame(() => {
                this.$refs.input && this.$refs.input.blur();
            });
        },
        clearableCallback() {
            this.$refs.input && this.$refs.input.focus();
            this.$nextTick(() => (this.internalValue = null));
        },
        genAppendSlot() {
            const slot = [];

            if (this.$slots["append-outer"]) {
                slot.push(this.$slots["append-outer"]);
            } else if (this.appendOuterIcon) {
                slot.push(this.genIcon("appendOuter"));
            }

            return this.genSlot("append", "outer", slot);
        },
        genPrependInnerSlot() {
            const slot = [];

            if (this.$slots["prepend-inner"]) {
                slot.push(this.$slots["prepend-inner"]);
            } else if (this.prependInnerIcon) {
                slot.push(this.genIcon("prependInner"));
            }

            return this.genSlot("prepend", "inner", slot);
        },
        genIconSlot() {
            const slot = [];

            if (this.$slots.append) {
                slot.push(this.$slots.append);
            } else if (this.appendIcon) {
                slot.push(this.genIcon("append"));
            }

            return this.genSlot("append", "inner", slot);
        },
        genInputSlot() {
            const input = VInput.options.methods.genInputSlot.call(this);
            const prepend = this.genPrependInnerSlot();

            if (prepend) {
                input.children = input.children || [];
                input.children.unshift(prepend);
            }

            return input;
        },
        genClearIcon() {
            if (!this.clearable) {
                return null;
            }

            // if the text field has no content then don't display the clear icon.
            // We add an empty div because other controls depend on a ref to append inner
            if (!this.isDirty) {
                return this.genSlot("append", "inner", [this.$createElement("div")]);
            }

            return this.genSlot("append", "inner", [this.genIcon("clear", this.clearableCallback)]);
        },
        genCounter() {
            if (!this.hasCounter) return null;
            const max = this.maxLength;
            const props = {
                dark: this.dark,
                light: this.light,
                max,
                value: this.computedCounterValue,
            };

            return this.$scopedSlots.counter?.({ props }) ?? this.$createElement(VCounter, { props });
        },
        genControl() {
            return VInput.options.methods.genControl.call(this);
        },
        genDefaultSlot() {
            return [this.genFieldset(), this.genTextFieldSlot()];
        },
        genFieldset() {
            if (!this.outlined) return null;

            return this.$createElement(
                "fieldset",
                {
                    attrs: {
                        "aria-hidden": true,
                    },
                },
                [this.genLegend()],
            );
        },
        genLegend() {
            const span = this.$createElement("span", {
                domProps: { innerHTML: "&#8203;" },
            });

            return this.$createElement(
                "legend",
                {
                    style: {
                        width: convertToUnit(0),
                    },
                },
                [span],
            );
        },
        genInput() {
            const listeners = Object.assign({}, this.listeners$);
            delete listeners.change; // Change should not be bound externally

            return this.$createElement("input", {
                style: {},
                domProps: {
                    value: this.type === "number" && Object.is(this.lazyValue, -0) ? "-0" : this.lazyValue,
                    innerHTML: "",
                },
                attrs: {
                    ...this.attrs$,
                    autofocus: this.autofocus,
                    disabled: this.isDisabled,
                    id: this.computedId,
                    placeholder: this.placeholder,
                    readonly: this.isReadonly,
                    type: this.type,
                },
                on: Object.assign(listeners, {
                    blur: this.onBlur,
                    input: this.onInput,
                    focus: this.onFocus,
                    keydown: this.onKeyDown,
                }),
                ref: "input",
                directives: [
                    {
                        name: "resize",
                        modifiers: { quiet: true },
                        value: this.onResize,
                    },
                ],
            });
        },
        genMessages() {
            if (!this.showDetails) {
                return null;
            }

            const messagesNode = VInput.options.methods.genMessages.call(this);
            const counterNode = this.genCounter();

            return this.$createElement(
                "div",
                {
                    staticClass: "v-text-field__details",
                },
                [messagesNode, counterNode],
            );
        },
        genTextFieldSlot() {
            return this.$createElement(
                "div",
                {
                    staticClass: "v-text-field__slot",
                },
                [
                    this.prefix ? this.genAffix("prefix") : null,
                    this.genInput(),
                    this.suffix ? this.genAffix("suffix") : null,
                    this.genClearIcon(),
                    this.genIconSlot(),
                    this.genProgress(),
                ],
            );
        },
        genAffix(type: "prefix" | "suffix") {
            return this.$createElement(
                "div",
                {
                    class: `v-text-field__${type}`,
                    ref: type,
                },
                this[type],
            );
        },
        onBlur(e?: Event) {
            this.isFocused = false;
            e && this.$nextTick(() => this.$emit("blur", e));
        },
        onClick() {
            if (this.isFocused || this.isDisabled || !this.$refs.input) return;

            this.$refs.input.focus();
        },
        onFocus(e?: Event) {
            if (!this.$refs.input) return;

            const root = attachedRoot(this.$el);
            if (!root) return;

            if (root.activeElement !== this.$refs.input) {
                return this.$refs.input.focus();
            }

            if (!this.isFocused) {
                this.isFocused = true;
                e && this.$emit("focus", e);
            }
        },
        onInput(e: Event) {
            const target = e.target as HTMLInputElement;
            this.internalValue = target.value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e: KeyboardEvent) {
            if (e.code === "enter") this.$emit("change", this.internalValue);

            this.$emit("keydown", e);
        },
        onMouseDown(e: Event) {
            // Prevent input from being blurred
            if (e.target !== this.$refs.input) {
                e.preventDefault();
                e.stopPropagation();
            }

            VInput.options.methods.onMouseDown.call(this, e);
        },
        onMouseUp(e: Event) {
            if (this.hasMouseDown) this.focus();

            VInput.options.methods.onMouseUp.call(this, e);
        },
        setPrefixWidth() {
            if (!this.$refs.prefix) return;

            this.prefixWidth = this.$refs.prefix.offsetWidth;
        },
        setPrependWidth() {
            if (!this.outlined || !this.$refs["prepend-inner"]) return;

            this.prependWidth = this.$refs["prepend-inner"].offsetWidth;
        },
        tryAutofocus() {
            if (!this.autofocus || typeof document === "undefined" || !this.$refs.input) return false;

            const root = attachedRoot(this.$el);
            if (!root || root.activeElement === this.$refs.input) return false;

            this.$refs.input.focus();

            return true;
        },
        updateValue(val: boolean) {
            // Sets validationState from validatable
            this.hasColor = val;

            if (val) {
                this.initialValue = this.lazyValue;
            } else if (this.initialValue !== this.lazyValue) {
                this.$emit("change", this.lazyValue);
            }
        },
        onResize() {
            this.setPrefixWidth();
            this.setPrependWidth();
        },
    },
});
