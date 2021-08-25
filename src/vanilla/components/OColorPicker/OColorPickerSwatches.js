import Vue from "vue";

// Styles
import "./OColorPickerSwatches.scss";

// Components
import OIcon from "../OIcon/OIcon";

// Helpers
import colors from "../../utils/colors";
import { fromHex, parseColor } from "./utils";
import { convertToUnit, deepEqual } from "../../utils/helpers";
import Themeable from "../../mixins/themeable";

// Utils
import { contrastRatio } from "../../utils/color-utils";

function parseDefaultColors(colors) {
    return Object.keys(colors).map((key) => {
        const color = colors[key];
        return color.base
            ? [
                  color.base,
                  color.darken4,
                  color.darken3,
                  color.darken2,
                  color.darken1,
                  color.lighten1,
                  color.lighten2,
                  color.lighten3,
                  color.lighten4,
                  color.lighten5,
              ]
            : [color.black, color.white, color.transparent];
    });
}

const white = fromHex("#FFFFFF").rgba;
const black = fromHex("#000000").rgba;

export default Vue.extend({
    name: "OColorPickerSwatches",
    mixins: [Themeable],
    props: {
        swatches: {
            type: Array,
            default: () => parseDefaultColors(colors),
        },
        disabled: Boolean,
        color: Object,
        maxWidth: [Number, String],
        maxHeight: [Number, String],
    },
    methods: {
        genColor(color) {
            const content = this.$createElement(
                "div",
                {
                    style: {
                        background: color,
                    },
                },
                [
                    deepEqual(this.color, parseColor(color, null)) &&
                        this.$createElement(
                            OIcon,
                            {
                                props: {
                                    small: true,
                                    dark: contrastRatio(this.color.rgba, white) > 2 && this.color.alpha > 0.5,
                                    light: contrastRatio(this.color.rgba, black) > 2 && this.color.alpha > 0.5,
                                },
                            },
                            "$success",
                        ),
                ],
            );

            return this.$createElement(
                "div",
                {
                    staticClass: "v-color-picker__color",
                    on: {
                        // TODO: Less hacky way of catching transparent
                        click: () => this.disabled || this.$emit("update:color", fromHex(color === "transparent" ? "#00000000" : color)),
                    },
                },
                [content],
            );
        },
        genSwatches() {
            return this.swatches.map((swatch) => {
                const colors = swatch.map(this.genColor);

                return this.$createElement(
                    "div",
                    {
                        staticClass: "v-color-picker__swatch",
                    },
                    colors,
                );
            });
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "v-color-picker__swatches",
                style: {
                    maxWidth: convertToUnit(this.maxWidth),
                    maxHeight: convertToUnit(this.maxHeight),
                },
            },
            [this.$createElement("div", this.genSwatches())],
        );
    },
});
