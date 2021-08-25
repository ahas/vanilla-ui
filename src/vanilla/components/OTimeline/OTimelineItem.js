import Vue from "vue";

// Components
import OIcon from "../OIcon/OIcon";

// Mixins
import Themeable from "../../mixins/themeable";
import Colorable from "../../mixins/colorable";

export default Vue.extend({
    name: "OTimelineItem",
    mixins: [Colorable, Themeable],
    inject: ["timeline"],
    props: {
        color: {
            type: String,
            default: "primary",
        },
        fillDot: Boolean,
        hideDot: Boolean,
        icon: String,
        iconColor: String,
        large: Boolean,
        left: Boolean,
        right: Boolean,
        small: Boolean,
    },
    computed: {
        hasIcon() {
            return !!this.icon || !!this.$slots.icon;
        },
    },
    methods: {
        genBody() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-timeline-item__body",
                },
                this.$slots.default,
            );
        },
        genIcon() {
            if (this.$slots.icon) {
                return this.$slots.icon;
            }

            return this.$createElement(
                OIcon,
                {
                    props: {
                        color: this.iconColor,
                        dark: !this.theme.isDark,
                        small: this.small,
                    },
                },
                this.icon,
            );
        },
        genInnerDot() {
            const data = this.setBackgroundColor(this.color);

            return this.$createElement(
                "div",
                {
                    staticClass: "o-timeline-item__inner-dot",
                    ...data,
                },
                [this.hasIcon && this.genIcon()],
            );
        },
        genDot() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-timeline-item__dot",
                    class: {
                        "o-timeline-item__dot--small": this.small,
                        "o-timeline-item__dot--large": this.large,
                    },
                },
                [this.genInnerDot()],
            );
        },
        genDivider() {
            const children = [];

            if (!this.hideDot) children.push(this.genDot());

            return this.$createElement(
                "div",
                {
                    staticClass: "o-timeline-item__divider",
                },
                children,
            );
        },
        genOpposite() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-timeline-item__opposite",
                },
                this.$slots.opposite,
            );
        },
    },
    render(h) {
        const children = [this.genBody(), this.genDivider()];

        if (this.$slots.opposite) children.push(this.genOpposite());

        return h(
            "div",
            {
                staticClass: "o-timeline-item",
                class: {
                    "o-timeline-item--fill-dot": this.fillDot,
                    "o-timeline-item--before": this.timeline.reverse ? this.right : this.left,
                    "o-timeline-item--after": this.timeline.reverse ? this.left : this.right,
                    ...this.themeClasses,
                },
            },
            children,
        );
    },
});
