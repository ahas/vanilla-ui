import Vue from "vue";

// Styles
import "./OColorPicker.scss";

// Components
import OSheet from "../OSheet/OSheet";
import OColorPickerPreview from "./OColorPickerPreview";
import OColorPickerCanvas from "./OColorPickerCanvas";
import OColorPickerEdit, { Mode, modes } from "./OColorPickerEdit";
import OColorPickerSwatches from "./OColorPickerSwatches";

// Helpers
import { parseColor, fromRGBA, extractColor, hasAlpha } from "./utils";
import { deepEqual } from "../../utils/helpers";

// Mixins
import Elevatable from "../../mixins/elevatable";
import Themeable from "../../mixins/themeable";

export default Vue.extend({
    name: "OColorPicker",
    mixins: [Elevatable, Themeable],
    props: {
        canvasHeight: {
            type: [String, Number],
            default: 150,
        },
        disabled: Boolean,
        dotSize: {
            type: [Number, String],
            default: 10,
        },
        flat: Boolean,
        hideCanvas: Boolean,
        hideSliders: Boolean,
        hideInputs: Boolean,
        hideModeSwitch: Boolean,
        mode: {
            type: String,
            default: "rgba",
            validator: (v) => Object.keys(modes).includes(v),
        },
        showSwatches: Boolean,
        swatches: Array,
        swatchesMaxHeight: {
            type: [Number, String],
            default: 150,
        },
        value: {
            type: [Object, String],
        },
        width: {
            type: [Number, String],
            default: 300,
        },
    },

    data: () => ({
        internalValue: fromRGBA({ r: 255, g: 0, b: 0, a: 1 }),
    }),

    computed: {
        hideAlpha() {
            if (!this.value) return false;

            return !hasAlpha(this.value);
        },
    },

    watch: {
        value: {
            handler(color) {
                this.updateColor(parseColor(color, this.internalValue));
            },
            immediate: true,
        },
    },

    methods: {
        updateColor(color) {
            this.internalValue = color;
            const value = extractColor(this.internalValue, this.value);

            if (!deepEqual(value, this.value)) {
                this.$emit("input", value);
                this.$emit("update:color", this.internalValue);
            }
        },
        genCanvas() {
            return this.$createElement(OColorPickerCanvas, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    dotSize: this.dotSize,
                    width: this.width,
                    height: this.canvasHeight,
                },
                on: {
                    "update:color": this.updateColor,
                },
            });
        },
        genControls() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-color-picker__controls",
                },
                [!this.hideSliders && this.genPreview(), !this.hideInputs && this.genEdit()],
            );
        },
        genEdit() {
            return this.$createElement(OColorPickerEdit, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    hideAlpha: this.hideAlpha,
                    hideModeSwitch: this.hideModeSwitch,
                    mode: this.mode,
                },
                on: {
                    "update:color": this.updateColor,
                    "update:mode": (v) => this.$emit("update:mode", v),
                },
            });
        },
        genPreview() {
            return this.$createElement(OColorPickerPreview, {
                props: {
                    color: this.internalValue,
                    disabled: this.disabled,
                    hideAlpha: this.hideAlpha,
                },
                on: {
                    "update:color": this.updateColor,
                },
            });
        },
        genSwatches() {
            return this.$createElement(OColorPickerSwatches, {
                props: {
                    dark: this.dark,
                    light: this.light,
                    disabled: this.disabled,
                    swatches: this.swatches,
                    color: this.internalValue,
                    maxHeight: this.swatchesMaxHeight,
                },
                on: {
                    "update:color": this.updateColor,
                },
            });
        },
    },
    render(h) {
        return h(
            OSheet,
            {
                staticClass: "o-color-picker",
                class: {
                    "o-color-picker--flat": this.flat,
                    ...this.themeClasses,
                    ...this.elevationClasses,
                },
                props: {
                    maxWidth: this.width,
                },
            },
            [!this.hideCanvas && this.genCanvas(), (!this.hideSliders || !this.hideInputs) && this.genControls(), this.showSwatches && this.genSwatches()],
        );
    },
});
