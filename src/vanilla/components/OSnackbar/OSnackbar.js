import "./OSnackbar.scss";
import Vue from "vue";

// Components
import OSheet from "../OSheet/OSheet";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";
import Toggleable from "../../mixins/toggleable";
import { factory as PositionableFactory } from "../../mixins/positionable";

// Utils
import { convertToUnit, getSlot } from "../../utils/helpers";
import { deprecate, removed } from "../../utils/console";

export default Vue.extend({
    name: "OSnackbar",
    mixins: [OSheet, Colorable, Toggleable, PositionableFactory(["absolute", "bottom", "left", "right", "top"])],
    props: {
        app: Boolean,
        centered: Boolean,
        contentClass: {
            type: String,
            default: "",
        },
        multiLine: Boolean,
        text: Boolean,
        timeout: {
            type: [Number, String],
            default: 5000,
        },
        transition: {
            type: [Boolean, String],
            default: "o-snack-transition",
            validator: (v) => typeof v === "string" || v === false,
        },
        vertical: Boolean,
    },
    data: () => ({
        activeTimeout: -1,
    }),
    computed: {
        classes() {
            return {
                "o-snack--absolute": this.absolute,
                "o-snack--active": this.isActive,
                "o-snack--bottom": this.bottom || !this.top,
                "o-snack--centered": this.centered,
                "o-snack--has-background": this.hasBackground,
                "o-snack--left": this.left,
                "o-snack--multi-line": this.multiLine && !this.vertical,
                "o-snack--right": this.right,
                "o-snack--text": this.text,
                "o-snack--top": this.top,
                "o-snack--vertical": this.vertical,
            };
        },
        // Text and outlined styles both
        // use transparent backgrounds
        hasBackground() {
            return !this.text && !this.outlined;
        },
        // Snackbar is dark by default
        // override themeable logic.
        isDark() {
            return this.hasBackground ? !this.light : Themeable.options.computed.isDark.call(this);
        },
        styles() {
            // Styles are not needed when
            // using the absolute prop.
            if (this.absolute) return {};

            const { bar, bottom, footer, insetFooter, left, right, top } = this.$vanilla.application;

            // Should always move for y-axis
            // applicationable components.
            return {
                paddingBottom: convertToUnit(bottom + footer + insetFooter),
                paddingLeft: !this.app ? undefined : convertToUnit(left),
                paddingRight: !this.app ? undefined : convertToUnit(right),
                paddingTop: convertToUnit(bar + top),
            };
        },
    },

    watch: {
        isActive: "setTimeout",
        timeout: "setTimeout",
    },
    mounted() {
        if (this.isActive) this.setTimeout();
    },
    created() {
        if (this.$attrs.hasOwnProperty("auto-height")) {
            removed("auto-height", this);
        }

        // eslint-disable-next-line eqeqeq
        if (this.timeout == 0) {
            deprecate('timeout="0"', "-1", this);
        }
    },
    methods: {
        genActions() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-snack__action ",
                },
                [
                    getSlot(this, "action", {
                        attrs: { class: "o-snack__btn" },
                    }),
                ],
            );
        },
        genContent() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-snack__content",
                    class: {
                        [this.contentClass]: true,
                    },
                    attrs: {
                        role: "status",
                        "aria-live": "polite",
                    },
                },
                [getSlot(this)],
            );
        },
        genWrapper() {
            const setColor = this.hasBackground ? this.setBackgroundColor : this.setTextColor;

            const data = setColor(this.color, {
                staticClass: "o-snack__wrapper",
                class: OSheet.options.computed.classes.call(this),
                directives: [
                    {
                        name: "show",
                        value: this.isActive,
                    },
                ],
                on: {
                    mouseenter: () => window.clearTimeout(this.activeTimeout),
                    mouseleave: this.setTimeout,
                },
            });

            return this.$createElement("div", data, [this.genContent(), this.genActions()]);
        },
        genTransition() {
            return this.$createElement(
                "transition",
                {
                    props: { name: this.transition },
                },
                [this.genWrapper()],
            );
        },
        setTimeout() {
            window.clearTimeout(this.activeTimeout);

            const timeout = Number(this.timeout);

            if (
                !this.isActive ||
                // TODO: remove 0 in v3
                [0, -1].includes(timeout)
            ) {
                return;
            }

            this.activeTimeout = window.setTimeout(() => {
                this.isActive = false;
            }, timeout);
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-snack",
                class: this.classes,
                style: this.styles,
            },
            [this.transition !== false ? this.genTransition() : this.genWrapper()],
        );
    },
});
