import "./OListItem.scss";
import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import Routable from "../../mixins/routable";
import { factory as GroupableFactory } from "../../mixins/groupable";
import Themeable from "../../mixins/themeable";
import { factory as ToggleableFactory } from "../../mixins/toggleable";

// Directives
import Ripple from "../../directives/ripple";

// Utils
import { KeyCodes } from "../../utils/helpers";
import { removed } from "../../utils/console";

export default Vue.extend({
    name: "OListItem",
    mixins: [Colorable, Routable, Themeable, GroupableFactory("listItemGroup"), ToggleableFactory("inputValue")],
    directives: {
        Ripple,
    },
    inject: {
        isInGroup: {
            default: false,
        },
        isInList: {
            default: false,
        },
        isInMenu: {
            default: false,
        },
        isInNav: {
            default: false,
        },
    },
    inheritAttrs: false,
    props: {
        activeClass: {
            type: String,
            default() {
                if (!this.listItemGroup) return "";

                return this.listItemGroup.activeClass;
            },
        },
        dense: Boolean,
        inactive: Boolean,
        link: Boolean,
        selectable: {
            type: Boolean,
        },
        tag: {
            type: String,
            default: "div",
        },
        threeLine: Boolean,
        twoLine: Boolean,
        value: null,
    },
    data: () => ({
        proxyClass: "o-list-item--active",
    }),
    computed: {
        classes() {
            return {
                "o-list-item": true,
                ...Routable.options.computed.classes.call(this),
                "o-list-item--dense": this.dense,
                "o-list-item--disabled": this.disabled,
                "o-list-item--link": this.isClickable && !this.inactive,
                "o-list-item--selectable": this.selectable,
                "o-list-item--three-line": this.threeLine,
                "o-list-item--two-line": this.twoLine,
                ...this.themeClasses,
            };
        },
        isClickable() {
            return Boolean(Routable.options.computed.isClickable.call(this) || this.listItemGroup);
        },
    },
    created() {
        if (this.$attrs.hasOwnProperty("avatar")) {
            removed("avatar", this);
        }
    },
    methods: {
        click(e) {
            if (e.detail) this.$el.blur();

            this.$emit("click", e);

            this.to || this.toggle();
        },
        genAttrs() {
            const attrs = {
                "aria-disabled": this.disabled ? true : undefined,
                tabindex: this.isClickable && !this.disabled ? 0 : -1,
                ...this.$attrs,
            };

            if (this.$attrs.hasOwnProperty("role")) {
                // do nothing, role already provided
            } else if (this.isInNav) {
                // do nothing, role is inherit
            } else if (this.isInGroup) {
                attrs.role = "option";
                attrs["aria-selected"] = String(this.isActive);
            } else if (this.isInMenu) {
                attrs.role = this.isClickable ? "menuitem" : undefined;
                attrs.id = attrs.id || `list-item-${this._uid}`;
            } else if (this.isInList) {
                attrs.role = "listitem";
            }

            return attrs;
        },
    },
    render(h) {
        let { tag, data } = this.generateRouteLink();

        data.attrs = {
            ...data.attrs,
            ...this.genAttrs(),
        };
        data[this.to ? "nativeOn" : "on"] = {
            ...data[this.to ? "nativeOn" : "on"],
            keydown: (e) => {
                if (e.keyCode === KeyCodes.enter) this.click(e);

                this.$emit("keydown", e);
            },
        };

        if (this.inactive) tag = "div";
        if (this.inactive && this.to) {
            data.on = data.nativeOn;
            delete data.nativeOn;
        }

        const children = this.$scopedSlots.default
            ? this.$scopedSlots.default({
                  active: this.isActive,
                  toggle: this.toggle,
              })
            : this.$slots.default;

        return h(tag, this.setTextColor(this.color, data), children);
    },
});
