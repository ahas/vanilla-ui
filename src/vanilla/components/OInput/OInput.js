import "./OInput.scss";
import Vue from "vue";
// Components
import { OIcon } from "../OIcon";
import { OLabel } from "../OLabel";
import { OMessages } from "../OMessages";

// Mixins
import BindsAttrs from "../../mixins/binds-attrs";
import Validatable from "../../mixins/validatable";

// Utils
import { convertToUnit, getSlot, kebabCase } from "../../utils/helpers";
import mergeData from "../../utils/merge-data";

/* @vue/component */
export default Vue.extend({
    name: "OInput",
    mixins: [BindsAttrs, Validatable],
    inheritAttrs: false,
    props: {
        appendIcon: String,
        backgroundColor: {
            type: String,
            default: "",
        },
        height: [Number, String],
        hideDetails: [Boolean, String],
        hint: String,
        id: String,
        label: String,
        loading: Boolean,
        persistentHint: Boolean,
        prependIcon: String,
        value: null,
        autocomplete: { type: [String, Boolean], default: "off" },
    },
    data() {
        return {
            lazyValue: this.value,
            hasMouseDown: false,
        };
    },
    computed: {
        classes() {
            return {
                "o-input--has-state": this.hasState,
                "o-input--hide-details": !this.showDetails,
                "o-input--is-label-active": this.isLabelActive,
                "o-input--is-dirty": this.isDirty,
                "o-input--is-disabled": this.isDisabled,
                "o-input--is-focused": this.isFocused,
                // <o-switch loading>.loading === '' so we can't just cast to boolean
                "o-input--is-loading": this.loading !== false && this.loading != null,
                "o-input--is-readonly": this.isReadonly,
                ...this.themeClasses,
            };
        },
        computedId() {
            return this.id || `input-${this._uid}`;
        },
        hasDetails() {
            return this.messagesToDisplay.length > 0;
        },
        hasHint() {
            return !this.hasMessages && !!this.hint && (this.persistentHint || this.isFocused);
        },
        hasLabel() {
            return !!(this.$slots.label || this.label);
        },
        // Proxy for `lazyValue`
        // This allows an input
        // to function without
        // a provided model
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit(this.$_modelEvent, val);
            },
        },
        isDirty() {
            return !!this.lazyValue;
        },
        isLabelActive() {
            return this.isDirty;
        },
        messagesToDisplay() {
            if (this.hasHint) {
                return [this.hint];
            }
            if (this.hideDetails || !this.hasMessages) {
                return [];
            }
            return this.validations
                .map((validation) => {
                    if (typeof validation === "string") return validation;

                    const validationResult = validation(this.internalValue);

                    return typeof validationResult === "string" ? validationResult : "";
                })
                .filter((message) => message !== "");
        },
        showDetails() {
            return this.hideDetails === false || (this.hideDetails === "auto" && this.hasDetails);
        },
    },
    watch: {
        value(val) {
            this.lazyValue = val;
        },
    },
    beforeCreate() {
        // o-radio-group needs to emit a different event
        // https://github.com/vuetifyjs/vuetify/issues/4752
        this.$_modelEvent = (this.$options.model && this.$options.model.event) || "input";
    },
    methods: {
        genContent() {
            return [this.genPrependSlot(), this.genControl(), this.genAppendSlot()];
        },
        genControl() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-input__control",
                },
                [this.genInputSlot(), this.genMessages()],
            );
        },
        genDefaultSlot() {
            return [this.genLabel(), this.$slots.default];
        },
        genIcon(type, cb, extraData = {}) {
            const icon = this[`${type}Icon`];
            const eventName = `click:${kebabCase(type)}`;
            const hasListener = !!(this.listeners$[eventName] || cb);

            const data = mergeData(
                {
                    attrs: {
                        "aria-label": hasListener ? kebabCase(type).split("-")[0] + " icon" : undefined,
                        color: this.validationState,
                        dark: this.dark,
                        disabled: this.isDisabled,
                        light: this.light,
                    },
                    on: !hasListener
                        ? undefined
                        : {
                              click: (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  this.$emit(eventName, e);
                                  cb && cb(e);
                              },
                              // Container has g event that will
                              // trigger menu open if enclosed
                              mouseup: (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                              },
                          },
                },
                extraData,
            );

            return this.$createElement(
                "div",
                {
                    staticClass: `o-input__icon`,
                    class: type ? `o-input__icon--${kebabCase(type)}` : undefined,
                },
                [this.$createElement(OIcon, data, icon)],
            );
        },
        genInputSlot() {
            return this.$createElement(
                "div",
                this.setBackgroundColor(this.backgroundColor, {
                    staticClass: "o-input__slot",
                    style: { height: convertToUnit(this.height) },
                    on: {
                        click: this.onClick,
                        mousedown: this.onMouseDown,
                        mouseup: this.onMouseUp,
                    },
                    ref: "input-slot",
                }),
                [this.genDefaultSlot()],
            );
        },
        genLabel() {
            if (!this.hasLabel) return null;

            return this.$createElement(
                OLabel,
                {
                    props: {
                        color: this.validationState,
                        dark: this.dark,
                        disabled: this.isDisabled,
                        focused: this.hasState,
                        for: this.computedId,
                        light: this.light,
                    },
                },
                this.$slots.label || this.label,
            );
        },
        genMessages() {
            if (!this.showDetails) {
                return null;
            }
            return this.$createElement(OMessages, {
                props: {
                    color: this.hasHint ? "" : this.validationState,
                    dark: this.dark,
                    light: this.light,
                    value: this.messagesToDisplay,
                },
                attrs: {
                    role: this.hasMessages ? "alert" : null,
                },
                scopedSlots: {
                    default: (props) => getSlot(this, "message", props),
                },
            });
        },
        genSlot(type, location, slot) {
            if (!slot.length) return null;

            const ref = `${type}-${location}`;

            return this.$createElement(
                "div",
                {
                    staticClass: `o-input__${ref}`,
                    ref,
                },
                slot,
            );
        },
        genPrependSlot() {
            const slot = [];

            if (this.$slots.prepend) {
                slot.push(this.$slots.prepend);
            } else if (this.prependIcon) {
                slot.push(this.genIcon("prepend"));
            }

            return this.genSlot("prepend", "outer", slot);
        },
        genAppendSlot() {
            const slot = [];

            // Append icon for text field was really
            // an appended inner icon, o-text-field
            // will overwrite this method in order to obtain
            // backwards compat
            if (this.$slots.append) {
                slot.push(this.$slots.append);
            } else if (this.appendIcon) {
                slot.push(this.genIcon("append"));
            }

            return this.genSlot("append", "outer", slot);
        },
        onClick(e) {
            this.$emit("click", e);
        },
        onMouseDown(e) {
            this.hasMouseDown = true;
            this.$emit("mousedown", e);
        },
        onMouseUp(e) {
            this.hasMouseDown = false;
            this.$emit("mouseup", e);
        },
    },
    render(h) {
        return h(
            "div",
            this.setTextColor(this.validationState, {
                staticClass: "o-input",
                class: this.classes,
            }),
            this.genContent(),
        );
    },
});
