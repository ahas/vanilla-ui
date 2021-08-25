import "./OProgressCircle.scss";
import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";

// Utils
import { convertToUnit } from "../../utils/helpers";

export default Vue.extend({
    name: "OProgress",
    mixins: [Colorable],
    props: {
        value: {
            type: [Number, String],
            default: 0,
        },
        button: Boolean,
        indeterminate: Boolean,
        rotate: {
            type: [Number, String],
            default: -90,
        },
        size: {
            type: [Number, String],
            default: 32,
        },
        width: {
            type: [Number, String],
            default: 4,
        },
    },
    data: () => ({
        radius: 20,
    }),
    computed: {
        computedSize() {
            return Number(this.size) + (this.button ? 8 : 0);
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        classes() {
            return {
                "o-progress-circle": true,
                "o-progress-circle--indeterminate": this.indeterminate,
                "o-progress-circle--button": this.button,
                ...this.colorableTextClasses,
            };
        },
        clampedValue() {
            if (this.value < 0) {
                return 0;
            }

            if (this.value > 100) {
                return 100;
            }

            return parseFloat(this.value);
        },
        strokeDashArray() {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset() {
            return ((100 - this.clampedValue) / 100) * this.circumference + "px";
        },
        strokeWidth() {
            return (Number(this.width) / +this.size) * this.viewBoxSize * 2;
        },
        styles() {
            return {
                height: convertToUnit(this.computedSize),
                width: convertToUnit(this.computedSize),
                ...this.colorableTextStyles,
            };
        },
        svgStyles() {
            const styles = {};
            if (!this.indeterminate) {
                styles.transform = `rotate(${Number(this.rotate)}deg)`;
            }
            return styles;
        },
        viewBoxSize() {
            return this.radius / (1 - Number(this.width) / +this.size);
        },
    },
    methods: {
        genCircle(name, offset) {
            return this.$createElement("circle", {
                class: `o-progress-circle__${name}`,
                attrs: {
                    fill: "transparent",
                    cx: 2 * this.viewBoxSize,
                    cy: 2 * this.viewBoxSize,
                    r: this.radius,
                    "stroke-width": this.strokeWidth,
                    "stroke-dasharray": this.strokeDashArray,
                    "stroke-dashoffset": offset,
                },
            });
        },
        genSvg() {
            const children = [this.indeterminate || this.genCircle("underlay", 0), this.genCircle("overlay", this.strokeDashOffset)];

            return this.$createElement(
                "svg",
                {
                    style: this.svgStyles,
                    attrs: {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`,
                    },
                },
                children,
            );
        },
        genInfo() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-progress-circle__info",
                },
                this.$slots.default,
            );
        },
    },
    render(h) {
        return h(
            "div",
            this.setTextColor(this.color, {
                staticClass: "o-progress-circle",
                attrs: {
                    role: "progressbar",
                    "aria-valuemin": 0,
                    "aria-valuemax": 100,
                    "aria-valuenow": this.indeterminate ? undefined : this.clampedValue,
                },
                class: this.classes,
                style: this.styles,
                on: this.$listeners,
            }),
            [this.genSvg(), this.genInfo()],
        );
    },
});
