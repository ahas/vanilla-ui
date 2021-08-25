import "./OTextField.scss";

import Vue from "vue";

// Directives
import resize from "../../directives/resize";
import ripple from "../../directives/ripple";
// Mixins
import Intersectable from "../../mixins/intersectable";
import Loadable from "../../mixins/loadable";
import Validatable from "../../mixins/validatable";
import { breaking } from "../../utils/console";
// Utils
import { attachedRoot } from "../../utils/dom";
import { convertToUnit, KeyCodes } from "../../utils/helpers";
// Components
import { OCounter } from "../OCounter";
// Extensions
import { OInput } from "../OInput";

/* @vue/component */
export default Vue.extend({
    name: "OTextField",
    mixins: [
        OInput,
        Intersectable({
            onVisible: ["onResize", "tryAutofocus"],
        }),
        Loadable,
    ],
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
            default: "mdi-close",
        },
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
        classes() {
            return {
                ...OInput.options.computed.classes.call(this),
                "o-text-field": true,
                "o-text-field--full-width": this.fullWidth,
                "o-text-field--prefix": this.prefix,
                "o-text-field--filled": this.filled,
                "o-text-field--is-booted": this.isBooted,
                "o-text-field--enclosed": this.isEnclosed,
                "o-text-field--reverse": this.reverse,
                "o-text-field--placeholder": this.placeholder,
            };
        },
        computedColor() {
            const computedColor = Validatable.options.computed.computedColor.call(this);

            if (!this.isFocused) {
                return computedColor;
            }

            return this.color || "primary";
        },
        computedCounterValue() {
            if (typeof this.length === "function") {
                return this.length(this.internalValue);
            }
            return [...(this.internalValue || "").toString()].length;
        },
        hasCounter() {
            return this.maxLength !== false && this.maxLength != null;
        },
        hasDetails() {
            return OInput.options.computed.hasDetails.call(this) || this.hasCounter;
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit("input", this.lazyValue);
            },
        },
        isDirty() {
            return this.lazyValue?.toString().length > 0 || this.badInput;
        },
        isEnclosed() {
            return this.filled || this.outlined;
        },
        isSingle() {
            return (
                this.singleLine ||
                this.fullWidth ||
                // https://material.io/components/text-fields/#filled-text-field
                this.filled
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
        blur(e) {
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
            const input = OInput.options.methods.genInputSlot.call(this);
            const prepend = this.genPrependInnerSlot();

            if (prepend) {
                input.children = input.children || [];
                input.children.unshift(prepend);
            }

            return input;
        },
        genClearIcon() {
            if (!this.clearable || this.isReadonly || this.isDisabled) {
                return null;
            }

            const data = this.isDirty ? { attrs: {} } : { attrs: { disabled: true } };
            data.attrs.tabindex = "-1";

            return this.genSlot("append", "inner", [this.genIcon("clear", this.clearableCallback, data)]);
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

            return this.$scopedSlots.counter?.({ props }) ?? this.$createElement(OCounter, { props });
        },
        genControl() {
            return OInput.options.methods.genControl.call(this);
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
                    autocomplete: !this.autocomplete || this.autocomplete == "off" ? "off" : "on",
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

            const messagesNode = OInput.options.methods.genMessages.call(this);
            const counterNode = this.genCounter();

            return this.$createElement(
                "div",
                {
                    staticClass: "o-text-field__details",
                },
                [messagesNode, counterNode],
            );
        },
        genTextFieldSlot() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-text-field__slot",
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
        genAffix(type) {
            return this.$createElement(
                "div",
                {
                    class: `o-text-field__${type}`,
                    ref: type,
                },
                this[type],
            );
        },
        onBlur(e) {
            this.isFocused = false;
            e && this.$nextTick(() => this.$emit("blur", e));
        },
        onClick() {
            if (this.isFocused || this.isDisabled || !this.$refs.input) return;

            this.$refs.input.focus();
        },
        onFocus(e) {
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
        onInput(e) {
            const target = e.target;
            this.internalValue = target.value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            if (e.keyCode === KeyCodes.enter) this.$emit("change", this.internalValue);

            this.$emit("keydown", e);
        },
        onMouseDown(e) {
            // Prevent input from being blurred
            if (e.target !== this.$refs.input) {
                e.preventDefault();
                e.stopPropagation();
            }

            OInput.options.methods.onMouseDown.call(this, e);
        },
        onMouseUp(e) {
            if (this.hasMouseDown) this.focus();

            OInput.options.methods.onMouseUp.call(this, e);
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
        updateValue(val) {
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
