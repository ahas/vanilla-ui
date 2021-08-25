import "./OOverlay.scss";
import Vue from "vue";

// Mixins
import Colorable from "./../../mixins/colorable";
import Themeable from "../../mixins/themeable";
import Toggleable from "./../../mixins/toggleable";

/* @vue/component */
export default Vue.extend({
    name: "OOverlay",
    mixins: [Colorable, Themeable, Toggleable],
    props: {
        absolute: Boolean,
        color: {
            type: String,
            default: "#212121",
        },
        dark: {
            type: Boolean,
            default: true,
        },
        opacity: {
            type: [Number, String],
            default: 0.46,
        },
        value: {
            default: true,
        },
        zIndex: {
            type: [Number, String],
            default: 5,
        },
    },
    computed: {
        __scrim() {
            const data = this.setBackgroundColor(this.color, {
                staticClass: "o-overlay__scrim",
                style: {
                    opacity: this.computedOpacity,
                },
            });

            return this.$createElement("div", data);
        },
        classes() {
            return {
                "o-overlay--absolute": this.absolute,
                "o-overlay--active": this.isActive,
                ...this.themeClasses,
            };
        },
        computedOpacity() {
            return Number(this.isActive ? this.opacity : 0);
        },
        styles() {
            return {
                zIndex: this.zIndex,
            };
        },
    },
    methods: {
        genContent() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-overlay__content",
                },
                this.$slots.default,
            );
        },
    },
    render(h) {
        const children = [this.__scrim];

        if (this.isActive) children.push(this.genContent());

        return h(
            "div",
            {
                staticClass: "o-overlay",
                class: this.classes,
                style: this.styles,
            },
            children,
        );
    },
});
