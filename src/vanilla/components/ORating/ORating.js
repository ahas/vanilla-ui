// Styles
import "./ORating.scss";

import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import Delayable from "../../mixins/delayable";
import Rippleable from "../../mixins/rippleable";
import Sizeable from "../../mixins/sizeable";
import Themeable from "../../mixins/themeable";
// Utils
import { createRange } from "../../utils/helpers";
// Components
import OIcon from "../OIcon/OIcon";

export default Vue.extend({
    name: "ORating",
    mixins: [Colorable, Delayable, Rippleable, Sizeable, Themeable],
    props: {
        backgroundColor: {
            type: String,
            default: "accent",
        },
        color: {
            type: String,
            default: "primary",
        },
        clearable: Boolean,
        dense: Boolean,
        emptyIcon: {
            type: String,
            default: "mdi-star-outline",
        },
        fullIcon: {
            type: String,
            default: "mdi-star",
        },
        halfIcon: {
            type: String,
            default: "mdi-star-half-full",
        },
        halfIncrements: Boolean,
        hover: Boolean,
        length: {
            type: [Number, String],
            default: 5,
        },
        readonly: Boolean,
        size: [Number, String],
        value: {
            type: Number,
            default: 0,
        },
        iconLabel: {
            type: String,
            default: "$vanilla.rating.aria-label.icon",
        },
    },
    data() {
        return {
            hoverIndex: -1,
            internalValue: this.value,
        };
    },
    computed: {
        directives() {
            if (this.readonly || !this.ripple) return [];

            return [
                {
                    name: "ripple",
                    value: { circle: true },
                },
            ];
        },
        iconProps() {
            const { dark, large, light, medium, small, size, xLarge, xSmall } = this.$props;

            return {
                dark,
                large,
                light,
                medium,
                size,
                small,
                xLarge,
                xSmall,
            };
        },
        isHovering() {
            return this.hover && this.hoverIndex >= 0;
        },
    },
    watch: {
        internalValue(val) {
            val !== this.value && this.$emit("input", val);
        },
        value(val) {
            this.internalValue = val;
        },
    },
    methods: {
        createClickFn(i) {
            return (e) => {
                if (this.readonly) return;

                const newValue = this.genHoverIndex(e, i);
                if (this.clearable && this.internalValue === newValue) {
                    this.internalValue = 0;
                } else {
                    this.internalValue = newValue;
                }
            };
        },
        createProps(i) {
            const props = {
                index: i,
                value: this.internalValue,
                click: this.createClickFn(i),
                isFilled: Math.floor(this.internalValue) > i,
                isHovered: Math.floor(this.hoverIndex) > i,
            };

            if (this.halfIncrements) {
                props.isHalfHovered = !props.isHovered && (this.hoverIndex - i) % 1 > 0;
                props.isHalfFilled = !props.isFilled && (this.internalValue - i) % 1 > 0;
            }

            return props;
        },
        genHoverIndex(e, i) {
            let isHalf = this.isHalfEvent(e);

            if (this.halfIncrements && this.$vanilla.rtl) {
                isHalf = !isHalf;
            }

            return i + (isHalf ? 0.5 : 1);
        },
        getIconName(props) {
            const isFull = this.isHovering ? props.isHovered : props.isFilled;
            const isHalf = this.isHovering ? props.isHalfHovered : props.isHalfFilled;

            return isFull ? this.fullIcon : isHalf ? this.halfIcon : this.emptyIcon;
        },
        getColor(props) {
            if (this.isHovering) {
                if (props.isHovered || props.isHalfHovered) return this.color;
            } else {
                if (props.isFilled || props.isHalfFilled) return this.color;
            }

            return this.backgroundColor;
        },
        isHalfEvent(e) {
            if (this.halfIncrements) {
                const rect = e.target && e.target.getBoundingClientRect();
                if (rect && e.pageX - rect.left < rect.width / 2) return true;
            }

            return false;
        },
        onMouseEnter(e, i) {
            this.runDelay("open", () => {
                this.hoverIndex = this.genHoverIndex(e, i);
            });
        },
        onMouseLeave() {
            this.runDelay("close", () => (this.hoverIndex = -1));
        },
        genItem(i) {
            const props = this.createProps(i);

            if (this.$scopedSlots.item) return this.$scopedSlots.item(props);

            const listeners = {
                click: props.click,
            };

            if (this.hover) {
                listeners.mouseenter = (e) => this.onMouseEnter(e, i);
                listeners.mouseleave = this.onMouseLeave;

                if (this.halfIncrements) {
                    listeners.mousemove = (e) => this.onMouseEnter(e, i);
                }
            }

            return this.$createElement(
                OIcon,
                this.setTextColor(this.getColor(props), {
                    attrs: {
                        "aria-label": this.$t.args(this.iconLabel, i + 1, Number(this.length)),
                    },
                    directives: this.directives,
                    props: this.iconProps,
                    on: listeners,
                }),
                [this.getIconName(props)],
            );
        },
    },
    render(h) {
        const children = createRange(Number(this.length)).map((i) => this.genItem(i));

        return h(
            "div",
            {
                staticClass: "o-rating",
                class: {
                    "o-rating--readonly": this.readonly,
                    "o-rating--dense": this.dense,
                },
            },
            children,
        );
    },
});
