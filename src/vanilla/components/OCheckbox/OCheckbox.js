import "./OCheckbox.scss";

// Components
import { OIcon } from "../OIcon";
import { OInput } from "../OInput";

// Mixins
import Selectable from "../../mixins/selectable";

export default Selectable.extend({
    name: "OCheckbox",
    props: {
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: "mdi-minus-box",
        },
        onIcon: {
            type: String,
            default: "mdi-checkbox-marked",
        },
        offIcon: {
            type: String,
            default: "mdi-checkbox-blank-outline",
        },
    },
    data() {
        return {
            inputIndeterminate: this.indeterminate,
        };
    },
    computed: {
        classes() {
            return {
                ...OInput.options.computed.classes.call(this),
                "o-input--selection-controls": true,
                "o-input--checkbox": true,
                "o-input--indeterminate": this.inputIndeterminate,
            };
        },
        computedIcon() {
            if (this.inputIndeterminate) {
                return this.indeterminateIcon;
            } else if (this.isActive) {
                return this.onIcon;
            } else {
                return this.offIcon;
            }
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.isDisabled && !this.inputIndeterminate) return undefined;
            if (this.hasError && this.shouldValidate) return "error";
            if (this.hasSuccess) return "success";
            if (this.hasColor !== null) return this.computedColor;
            return undefined;
        },
    },
    watch: {
        indeterminate(val) {
            // https://github.com/vuetifyjs/vuetify/issues/8270
            this.$nextTick(() => (this.inputIndeterminate = val));
        },
        inputIndeterminate(val) {
            this.$emit("update:indeterminate", val);
        },
        isActive() {
            if (!this.indeterminate) return;
            this.inputIndeterminate = false;
        },
    },
    methods: {
        genCheckbox() {
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
                                dense: this.dense,
                                dark: this.dark,
                                light: this.light,
                            },
                        }),
                        this.computedIcon,
                    ),
                    this.genInput("checkbox", {
                        ...this.attrs$,
                        "aria-checked": this.inputIndeterminate ? "mixed" : this.isActive.toString(),
                    }),
                    this.genRipple(this.setTextColor(this.rippleState)),
                ],
            );
        },
        genDefaultSlot() {
            return [this.genCheckbox(), this.genLabel()];
        },
    },
});
