// Styles
import "./OBadge.scss";

import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import { factory as PositionableFactory } from "../../mixins/positionable";
import Themeable from "../../mixins/themeable";
import Toggleable from "../../mixins/toggleable";
import Transitionable from "../../mixins/transitionable";
// Utils
import { convertToUnit, getSlot } from "../../utils/helpers";
// Components
import OIcon from "../OIcon/OIcon";

export default Vue.extend({
    name: "o-badge",
    mixins: [Colorable, PositionableFactory(["left", "bottom"]), Themeable, Toggleable, Transitionable],
    props: {
        avatar: Boolean,
        bordered: Boolean,
        color: {
            type: String,
            default: "primary",
        },
        content: { required: false },
        dot: Boolean,
        label: {
            type: String,
            default: "$vanilla.badge",
        },
        icon: String,
        inline: Boolean,
        offsetX: [Number, String],
        offsetY: [Number, String],
        overlap: Boolean,
        tile: Boolean,
        transition: {
            type: String,
            default: "scale-rotate-transition",
        },
        value: { default: true },
    },
    computed: {
        classes() {
            return {
                "o-badge--avatar": this.avatar,
                "o-badge--bordered": this.bordered,
                "o-badge--bottom": this.bottom,
                "o-badge--dot": this.dot,
                "o-badge--icon": this.icon != null,
                "o-badge--inline": this.inline,
                "o-badge--left": this.left,
                "o-badge--overlap": this.overlap,
                "o-badge--tile": this.tile,
                ...this.themeClasses,
            };
        },
        computedBottom() {
            return this.bottom ? "auto" : this.computedYOffset;
        },
        computedLeft() {
            if (this.isRtl) {
                return this.left ? this.computedXOffset : "auto";
            }

            return this.left ? "auto" : this.computedXOffset;
        },
        computedRight() {
            if (this.isRtl) {
                return this.left ? "auto" : this.computedXOffset;
            }

            return !this.left ? "auto" : this.computedXOffset;
        },
        computedTop() {
            return this.bottom ? this.computedYOffset : "auto";
        },
        computedXOffset() {
            return this.calcPosition(this.offsetX);
        },
        computedYOffset() {
            return this.calcPosition(this.offsetY);
        },
        isRtl() {
            return this.$vanilla.rtl;
        },
        // Default fallback if offsetX
        // or offsetY are undefined.
        offset() {
            if (this.overlap) return this.dot ? 8 : 12;
            return this.dot ? 2 : 4;
        },
        styles() {
            if (this.inline) return {};

            return {
                bottom: this.computedBottom,
                left: this.computedLeft,
                right: this.computedRight,
                top: this.computedTop,
            };
        },
    },
    methods: {
        calcPosition(offset) {
            return `calc(100% - ${convertToUnit(offset || this.offset)})`;
        },
        genBadge() {
            const label = this.$attrs["aria-label"] || this.$t(this.label);

            const data = this.setBackgroundColor(this.color, {
                staticClass: "o-badge__badge",
                style: this.styles,
                attrs: {
                    "aria-atomic": this.$attrs["aria-atomic"] || "true",
                    "aria-label": label,
                    "aria-live": this.$attrs["aria-live"] || "polite",
                    title: this.$attrs.title,
                    role: this.$attrs.role || "status",
                },
                directives: [
                    {
                        name: "show",
                        value: this.isActive,
                    },
                ],
            });

            const badge = this.$createElement("span", data, [this.genBadgeContent()]);

            if (!this.transition) return badge;

            return this.$createElement(
                "transition",
                {
                    props: {
                        name: this.transition,
                        origin: this.origin,
                        mode: this.mode,
                    },
                },
                [badge],
            );
        },
        genBadgeContent() {
            // Dot prop shows no content
            if (this.dot) return undefined;

            const slot = getSlot(this, "badge");

            if (slot) return slot;
            if (this.content) return String(this.content);
            if (this.icon) return this.$createElement(OIcon, this.icon);

            return undefined;
        },
        genBadgeWrapper() {
            return this.$createElement(
                "span",
                {
                    staticClass: "o-badge__wrapper",
                },
                [this.genBadge()],
            );
        },
    },
    render(h) {
        const badge = [this.genBadgeWrapper()];
        const children = [getSlot(this)];
        const { "aria-atomic": _x, "aria-label": _y, "aria-live": _z, role, title, ...attrs } = this.$attrs;

        if (this.inline && this.left) children.unshift(badge);
        else children.push(badge);

        return h(
            "span",
            {
                staticClass: "o-badge",
                attrs,
                class: this.classes,
            },
            children,
        );
    },
});
