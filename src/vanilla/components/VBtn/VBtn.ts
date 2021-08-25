import "./OBtn.scss";
import Vue from "vue";
// Mixins
import Routable from "../../mixins/routable";
import Positionable from "../../mixins/positionable";
import Elevatable from "../../mixins/elevatable";
import Sizeable from "../../mixins/sizeable";
import { factory as GroupableFactory } from "../../mixins/groupable";
import { factory as ToggleableFactory } from "../../mixins/toggleable";
import VSheet from "../VSheet/VSheet";

// Components
import VProgressCircle from "../VProgress/VProgressCircle";

export default Vue.extend({
    name: "VBtn",
    inject: {
        oform: {
            default: null,
        },
    },
    mixins: [VSheet, Routable, Positionable, Sizeable, GroupableFactory("btnGroup"), ToggleableFactory("value")],
    props: {
        activeClass: {
            type: String,
            default() {
                if (!this.btnGroup) {
                    return "";
                }
                return this.btnGroup.activeClass;
            },
        },
        tag: { type: String, default: "button" },
        tile: Boolean,
        text: Boolean,
        outlined: Boolean,
        icon: Boolean,
        square: Boolean,
        block: Boolean,
        disabled: Boolean,
        loading: Boolean,
        type: { type: String, default: "button" },
    },
    data: () => ({
        proxyClass: "o-btn--active",
    }),
    computed: {
        computedDisabled() {
            return this.oform?.disabled || this.disabled;
        },
        classes() {
            return {
                "o-btn": true,
                ...Routable.options.computed.classes.call(this),
                "o-btn--default": !this.color,
                "o-btn--absolute": this.absolute,
                "o-btn--block": this.block,
                "o-btn--bottom": this.bottom,
                "o-btn--disabled": this.computedDisabled,
                "o-btn--fixed": this.fixed,
                "o-btn--icon": this.icon,
                "o-btn--left": this.left,
                "o-btn--loading": this.loading,
                "o-btn--outlined": this.outlined,
                "o-btn--dashed": this.dashed,
                "o-btn--right": this.right,
                "o-btn--round": this.icon,
                "o-btn--square": this.square,
                "o-btn--router": this.to,
                "o-btn--text": this.text,
                "o-btn--tile": this.tile,
                "o-btn--has-bg": this.hasBg,
                "o-btn--top": this.top,
                ...this.themeClasses,
                ...this.groupClasses,
                ...this.elevationClasses,
                ...this.sizeableClasses,
            };
        },
        computedElevation() {
            if (this.disabled) {
                return undefined;
            }
            return Elevatable.options.computed.computedElevation.call(this);
        },
        computedRipple() {
            const defaultRipple = this.icon ? { circle: true } : true;
            if (this.disabled) {
                return false;
            }
            return this.ripple ?? defaultRipple;
        },
        hasBg() {
            return !this.text && !this.outlined && !this.dashed && !this.icon;
        },
    },
    methods: {
        click(e: Event) {
            this.$emit("click", e);
            this.btnGroup && this.toggle();
        },
        genContent() {
            return this.$createElement(
                "span",
                {
                    staticClass: "o-btn__content",
                },
                this.$slots.default,
            );
        },
        genLoader() {
            return this.$createElement(
                "span",
                {
                    class: "o-btn__loader",
                },
                this.$slots.loader || [
                    this.$createElement(VProgressCircle, {
                        props: {
                            indeterminate: true,
                            size: 23,
                            width: 2,
                        },
                    }),
                ],
            );
        },
    },
    render(h) {
        const children = [this.genContent(), this.loading && this.genLoader()];
        const { tag, data } = this.generateRouteLink();
        const setColor = this.hasBg ? this.setBackgroundColor : this.setTextColor;

        if (tag === "button") {
            data.attrs.type = this.type;
            data.attrs.disabled = this.disabled;
        }
        data.attrs.value = ["string", "number"].includes(typeof this.value) ? this.value : JSON.stringify(this.value);

        return h(tag, this.disabled ? data : setColor(this.color, data), children);
    },
});
