import "./OBtn.scss";

// Mixins
import Routable from "../../mixins/routable";
import Positionable from "../../mixins/positionable";
import Elevatable, { ComputedElevation } from "../../mixins/elevatable";
import Sizeable from "../../mixins/sizeable";
import { factory as GroupableFactory } from "../../mixins/groupable";
import { factory as ToggleableFactory } from "../../mixins/toggleable";
import VSheet from "../VSheet/VSheet";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Components
import VProgressCircle from "../VProgress/VProgressCircle";

// Utilities
import mixins, { ExtractVue } from "../../utils/mixins";
import { ComputedRipple } from "../../directives/ripple";

// Types
import { VNode } from "vue/types";
import { PropValidator } from "vue/types/options";

const BaseMixins = mixins(
    VSheet,
    Routable,
    Positionable,
    Sizeable,
    RegistrableInject<"vform", any>("vform"),
    GroupableFactory("btnGroup"),
    ToggleableFactory("value"),
);

interface options extends ExtractVue<typeof BaseMixins> {
    $el: HTMLElement;
}

export default BaseMixins.extend<options>().extend({
    name: "v-btn",
    props: {
        activeClass: {
            type: String,
            default(): string | undefined {
                if (!this.btnGroup) {
                    return "";
                }
                return this.btnGroup.activeClass;
            },
        } as any as PropValidator<string>,
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
        computedDisabled(): boolean {
            return this.vform?.disabled || this.disabled;
        },
        classes(): object {
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
        computedElevation(): ComputedElevation {
            if (this.disabled) {
                return undefined;
            }
            return Elevatable.options.computed.computedElevation.call(this);
        },
        computedRipple(): ComputedRipple {
            const defaultRipple = this.icon ? { circle: true } : true;
            if (this.disabled) {
                return false;
            }
            return this.ripple ?? defaultRipple;
        },
        hasBg(): boolean {
            return !this.text && !this.outlined && !this.dashed && !this.icon;
        },
    },
    methods: {
        click(e: Event) {
            this.$emit("click", e);
            this.btnGroup && this.toggle();
        },
        genContent(): VNode {
            return this.$createElement(
                "span",
                {
                    staticClass: "o-btn__content",
                },
                this.$slots.default,
            );
        },
        genLoader(): VNode {
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
    render(h): VNode {
        const children = [this.genContent(), this.loading && this.genLoader()];
        const { tag, data } = this.generateRouteLink();
        const setColor = this.hasBg ? this.setBackgroundColor : this.setTextColor;

        if (tag === "button") {
            data.attrs!.type = this.type;
            data.attrs!.disabled = this.disabled;
        }
        data.attrs!.value = ["string", "number"].includes(typeof this.value) ? this.value : JSON.stringify(this.value);

        return h(tag, this.disabled ? data : setColor(this.color, data), children);
    },
});
