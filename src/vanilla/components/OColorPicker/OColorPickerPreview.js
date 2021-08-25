// Styles
import "./OColorPickerPreview.scss";

import Vue from "vue";

// Utils
import { RGBAtoCSS, RGBtoCSS } from "../../utils/color-utils";
// Components
import OSlider from "../OSlider/OSlider";
import { fromHSVA } from "./utils";

export default Vue.extend({
    name: "OColorPickerPreview",
    props: {
        color: Object,
        disabled: Boolean,
        hideAlpha: Boolean,
    },
    methods: {
        genAlpha() {
            return this.genTrack({
                staticClass: "o-color-picker__alpha",
                props: {
                    thumbColor: "grey lighten-2",
                    hideDetails: true,
                    value: this.color.alpha,
                    step: 0,
                    min: 0,
                    max: 1,
                },
                style: {
                    backgroundImage: this.disabled
                        ? undefined
                        : `linear-gradient(to ${this.$vanilla.rtl ? "left" : "right"}, transparent, ${RGBtoCSS(this.color.rgba)})`,
                },
                on: {
                    input: (val) => this.color.alpha !== val && this.$emit("update:color", fromHSVA({ ...this.color.hsva, a: val })),
                },
            });
        },
        genSliders() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-color-picker__sliders",
                },
                [this.genHue(), !this.hideAlpha && this.genAlpha()],
            );
        },
        genDot() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-color-picker__dot",
                },
                [
                    this.$createElement("div", {
                        style: {
                            background: RGBAtoCSS(this.color.rgba),
                        },
                    }),
                ],
            );
        },
        genHue() {
            return this.genTrack({
                staticClass: "o-color-picker__hue",
                props: {
                    thumbColor: "grey lighten-2",
                    hideDetails: true,
                    value: this.color.hue,
                    step: 0,
                    min: 0,
                    max: 360,
                },
                on: {
                    input: (val) => this.color.hue !== val && this.$emit("update:color", fromHSVA({ ...this.color.hsva, h: val })),
                },
            });
        },
        genTrack(options) {
            return this.$createElement(OSlider, {
                class: "o-color-picker__track",
                ...options,
                props: {
                    disabled: this.disabled,
                    ...options.props,
                },
            });
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-color-picker__preview",
                class: {
                    "o-color-picker__preview--hide-alpha": this.hideAlpha,
                },
            },
            [this.genDot(), this.genSliders()],
        );
    },
});
