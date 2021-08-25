import Vue from "vue";

// Styles
import "./ORadio.scss";

// Components
import { OLabel } from "../OLabel";
import { OIcon } from "../OIcon";
import { OInput } from "../OInput";

// Mixins
import BindsAttrs from "../../mixins/binds-attrs";
import Colorable from "../../mixins/colorable";
import { factory as GroupableFactory } from "../../mixins/groupable";
import Rippleable from "../../mixins/rippleable";
import Themeable from "../../mixins/themeable";
import Selectable, { prevent } from "../../mixins/selectable";

// Utils
import { getSlot } from "../../utils/helpers";
import { mergeListeners } from "../../utils/merge-data";

/* @vue/component */
export default Vue.extend({
    name: "ORadio",
    mixins: [BindsAttrs, Colorable, Rippleable, GroupableFactory("radioGroup"), Themeable],
    inheritAttrs: false,
    props: {
        disabled: Boolean,
        id: String,
        label: String,
        name: String,
        offIcon: {
            type: String,
            default: "mdi-radiobox-blank",
        },
        onIcon: {
            type: String,
            default: "mdi-radiobox-marked",
        },
        readonly: Boolean,
        value: {
            default: null,
        },
    },
    data: () => ({
        isFocused: false,
    }),
    computed: {
        classes() {
            return {
                "o-radio--is-disabled": this.isDisabled,
                "o-radio--is-focused": this.isFocused,
                ...this.themeClasses,
                ...this.groupClasses,
            };
        },
        computedColor() {
            return Selectable.options.computed.computedColor.call(this);
        },
        computedIcon() {
            return this.isActive ? this.onIcon : this.offIcon;
        },
        computedId() {
            return OInput.options.computed.computedId.call(this);
        },
        hasLabel: OInput.options.computed.hasLabel,
        hasState() {
            return (this.radioGroup || {}).hasState;
        },
        isDisabled() {
            return this.disabled || (!!this.radioGroup && this.radioGroup.isDisabled);
        },
        isReadonly() {
            return this.readonly || (!!this.radioGroup && this.radioGroup.isReadonly);
        },
        computedName() {
            if (this.name || !this.radioGroup) {
                return this.name;
            }

            return this.radioGroup.name || `radio-${this.radioGroup._uid}`;
        },
        rippleState() {
            return Selectable.options.computed.rippleState.call(this);
        },
        validationState() {
            return (this.radioGroup || {}).validationState || this.computedColor;
        },
    },
    methods: {
        genInput(args) {
            // We can't actually use the mixin directly because
            // it's made for standalone components, but its
            // genInput method is exactly what we need
            return Selectable.options.methods.genInput.call(this, "radio", args);
        },
        genLabel() {
            if (!this.hasLabel) return null;

            return this.$createElement(
                OLabel,
                {
                    on: {
                        // Label shouldn't cause the input to focus
                        click: prevent,
                    },
                    attrs: {
                        for: this.computedId,
                    },
                    props: {
                        color: this.validationState,
                        focused: this.hasState,
                    },
                },
                getSlot(this, "label") || this.label,
            );
        },
        genRadio() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-input--selection-controls__input",
                },
                [
                    this.$createElement(
                        OIcon,
                        this.setTextColor(this.validationState, {
                            props: {
                                dense: this.radioGroup && this.radioGroup.dense,
                            },
                        }),
                        this.computedIcon,
                    ),
                    this.genInput({
                        name: this.computedName,
                        value: this.value,
                        ...this.attrs$,
                    }),
                    this.genRipple(this.setTextColor(this.rippleState)),
                ],
            );
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit("focus", e);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit("blur", e);
        },
        onChange() {
            if (this.isDisabled || this.isReadonly || this.isActive) return;

            this.toggle();
        },
        onKeydown: () => {}, // Override default with noop
    },
    render(h) {
        const data = {
            staticClass: "o-radio",
            class: this.classes,
            on: mergeListeners(
                {
                    click: this.onChange,
                },
                this.listeners$,
            ),
        };

        return h("div", data, [this.genRadio(), this.genLabel()]);
    },
});
