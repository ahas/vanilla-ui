import "./VProgressCircle.scss";

// Mixins
import Colorable from "../../mixins/colorable";

// Utilities
import { convertToUnit } from "../../utils/helpers";
import mixins from "../../utils/mixins";

// Types
import { VNode } from "vue/types";

const BaseMixins = mixins(Colorable);

export default BaseMixins.extend({
    name: "v-progress-circle",
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
        computedSize(): number {
            return Number(this.size) + (this.button ? 8 : 0);
        },
        circumference(): number {
            return 2 * Math.PI * this.radius;
        },
        classes(): object {
            return {
                "o-progress-circle": true,
                "o-progress-circle--indeterminate": this.indeterminate,
                "o-progress-circle--button": this.button,
            };
        },
        clampedValue(): number {
            if (this.value < 0) {
                return 0;
            }

            if (this.value > 100) {
                return 100;
            }

            return parseFloat(this.value);
        },
        strokeDashArray(): number {
            return Math.round(this.circumference * 1000) / 1000;
        },
        strokeDashOffset(): string {
            return ((100 - this.clampedValue) / 100) * this.circumference + "px";
        },
        strokeWidth(): number {
            return (Number(this.width) / +this.size) * this.viewBoxSize * 2;
        },
        styles(): object {
            return {
                height: convertToUnit(this.computedSize),
                width: convertToUnit(this.computedSize),
            };
        },
        svgStyles(): object {
            const styles = {} as any;
            if (!this.indeterminate) {
                styles.transform = `rotate(${Number(this.rotate)}deg)`;
            }
            return styles;
        },
        viewBoxSize(): number {
            return this.radius / (1 - Number(this.width) / +this.size);
        },
    },
    methods: {
        genCircle(name: string, offset: number | string): VNode {
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
        genSvg(): VNode {
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
        genInfo(): VNode {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-progress-circle__info",
                },
                this.$slots.default,
            );
        },
    },
    render(h): VNode {
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
