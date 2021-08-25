import "./OChip.scss";
import Vue from "vue";
// Components
import OIcon from "../OIcon/OIcon";
import { OExpandXTransition } from "../transitions";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";
import Routable from "../../mixins/routable";
import Sizeable from "../../mixins/sizeable";
import { factory as GroupableFactory } from "../../mixins/groupable";
import { factory as ToggleableFactory } from "../../mixins/toggleable";

// Utils
import { breaking } from "../../utils/console";

/* @vue/component */
export default Vue.extend({
    name: "OChip",
    mixins: [Colorable, Sizeable, Routable, Themeable, GroupableFactory("chipGroup"), ToggleableFactory("inputValue")],
    props: {
        active: {
            type: Boolean,
            default: true,
        },
        activeClass: {
            type: String,
            default() {
                if (!this.chipGroup) return "";
                return this.chipGroup.activeClass;
            },
        },
        close: Boolean,
        closeIcon: {
            type: String,
            default: "mdi-close",
        },
        closeLabel: {
            type: String,
            default: "Close",
        },
        disabled: Boolean,
        draggable: Boolean,
        filter: Boolean,
        filterIcon: {
            type: String,
            default: "mdi-check",
        },
        label: Boolean,
        link: Boolean,
        outlined: Boolean,
        pill: Boolean,
        tag: {
            type: String,
            default: "span",
        },
        textColor: String,
        value: null,
    },
    data: () => ({
        proxyClass: "o-chip--active",
    }),
    computed: {
        classes() {
            return {
                "o-chip": true,
                "o-chip--clickable": this.isClickable,
                "o-chip--disabled": this.disabled,
                "o-chip--draggable": this.draggable,
                "o-chip--label": this.label,
                "o-chip--link": this.isLink,
                "o-chip--no-color": !this.color,
                "o-chip--outlined": this.outlined,
                "o-chip--pill": this.pill,
                "o-chip--removable": this.hasClose,
                ...Routable.options.computed.classes.call(this),
                ...this.themeClasses,
                ...this.sizeableClasses,
                ...this.groupClasses,
            };
        },
        styles() {
            return {
                ...this.colorableStyles,
            };
        },
        hasClose() {
            return Boolean(this.close);
        },
        isClickable() {
            return Boolean(Routable.options.computed.isClickable.call(this) || this.chipGroup);
        },
    },
    created() {
        const breakingProps = [
            ["outline", "outlined"],
            ["selected", "input-value"],
            ["value", "active"],
            ["@input", "@active.sync"],
        ];

        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
        });
    },
    methods: {
        click(e) {
            this.$emit("click", e);
            this.chipGroup && this.toggle();
        },
        genFilter() {
            const children = [];
            if (this.isActive) {
                children.push(
                    this.$createElement(
                        OIcon,
                        {
                            staticClass: "o-chip__filter",
                            props: { left: true },
                        },
                        this.filterIcon,
                    ),
                );
            }

            return this.$createElement(OExpandXTransition, children);
        },
        genClose() {
            return this.$createElement(
                VIcon,
                {
                    staticClass: "o-chip__close",
                    props: {
                        right: true,
                        size: 18,
                    },
                    attrs: {
                        "aria-label": this.t?.("label.close", "Close") || "Close",
                    },
                    on: {
                        click: (e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            this.$emit("click:close");
                            this.$emit("update:active", false);
                        },
                    },
                },
                this.closeIcon,
            );
        },
        genContent() {
            return this.$createElement(
                "span",
                {
                    staticClass: "o-chip__content",
                },
                [this.filter && this.genFilter(), this.$slots.default, this.hasClose && this.genClose()],
            );
        },
    },
    render(h) {
        const children = [this.genContent()];
        let { tag, data } = this.generateRouteLink();
        data.attrs = {
            ...data.attrs,
            draggable: this.draggable ? "true" : undefined,
            tabindex: this.chipGroup && !this.disabled ? 0 : data.attrs.tabindex,
        };
        data.directives.push({
            name: "show",
            value: this.active,
        });
        data = this.setBackgroundColor(this.color, data);
        const color = this.textColor || (this.outlined && this.color);

        return h(tag, this.setTextColor(color, data), children);
    },
});
