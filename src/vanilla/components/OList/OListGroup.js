import Vue from "vue";

// Components
import OIcon from "../OIcon/OIcon";
import OListItem from "./OListItem";
import OListItemIcon from "./OListItemIcon";

// Mixins
import BindsAttrs from "../../mixins/binds-attrs";
import Bootable from "../../mixins/bootable";
import Colorable from "../../mixins/colorable";
import Toggleable from "../../mixins/toggleable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Directives
import ripple from "../../directives/ripple";

// Transitions
import { OExpandTransition } from "../transitions";

// Utils
import { getSlot } from "../../utils/helpers";

export default Vue.extend({
    name: "o-list-group",
    mixins: [BindsAttrs, Bootable, Colorable, RegistrableInject("list"), Toggleable],
    directives: { ripple },
    props: {
        activeClass: {
            type: String,
            default: "",
        },
        appendIcon: {
            type: String,
            default: "$expand",
        },
        color: {
            type: String,
            default: "primary",
        },
        disabled: Boolean,
        group: String,
        noAction: Boolean,
        prependIcon: String,
        ripple: {
            type: [Boolean, Object],
            default: true,
        },
        subGroup: Boolean,
    },
    computed: {
        classes() {
            return {
                "o-list-group--active": this.isActive,
                "o-list-group--disabled": this.disabled,
                "o-list-group--no-action": this.noAction,
                "o-list-group--sub-group": this.subGroup,
            };
        },
    },
    watch: {
        isActive(val) {
            if (!this.subGroup && val) {
                this.list && this.list.listClick(this._uid);
            }
        },
        $route: "onRouteChange",
    },
    created() {
        this.list && this.list.register(this);

        if (this.group && this.$route && this.value == null) {
            this.isActive = this.matchRoute(this.$route.path);
        }
    },
    beforeDestroy() {
        this.list && this.list.unregister(this);
    },
    methods: {
        click(e) {
            if (this.disabled) return;

            this.isBooted = true;

            this.$emit("click", e);
            this.$nextTick(() => (this.isActive = !this.isActive));
        },
        genIcon(icon) {
            return this.$createElement(OIcon, icon);
        },
        genAppendIcon() {
            const icon = !this.subGroup ? this.appendIcon : false;

            if (!icon && !this.$slots.appendIcon) return null;

            return this.$createElement(
                OListItemIcon,
                {
                    staticClass: "o-list-group__header__append-icon",
                },
                [this.$slots.appendIcon || this.genIcon(icon)],
            );
        },
        genHeader() {
            return this.$createElement(
                OListItem,
                {
                    staticClass: "o-list-group__header",
                    attrs: {
                        "aria-expanded": String(this.isActive),
                        role: "button",
                    },
                    class: {
                        [this.activeClass]: this.isActive,
                    },
                    props: {
                        inputValue: this.isActive,
                    },
                    directives: [
                        {
                            name: "ripple",
                            value: this.ripple,
                        },
                    ],
                    on: {
                        ...this.listeners$,
                        click: this.click,
                    },
                },
                [this.genPrependIcon(), this.$slots.activator, this.genAppendIcon()],
            );
        },
        genItems() {
            return this.showLazyContent(() => [
                this.$createElement(
                    "div",
                    {
                        staticClass: "o-list-group__items",
                        directives: [
                            {
                                name: "show",
                                value: this.isActive,
                            },
                        ],
                    },
                    getSlot(this),
                ),
            ]);
        },
        genPrependIcon() {
            const icon = this.subGroup && this.prependIcon == null ? "mdi-menu-down" : this.prependIcon;

            if (!icon && !this.$slots.prependIcon) return null;

            return this.$createElement(
                OListItemIcon,
                {
                    staticClass: "o-list-group__header__prepend-icon",
                },
                [this.$slots.prependIcon || this.genIcon(icon)],
            );
        },
        onRouteChange(to) {
            if (!this.group) return;

            const isActive = this.matchRoute(to.path);

            if (isActive && this.isActive !== isActive) {
                this.list && this.list.listClick(this._uid);
            }

            this.isActive = isActive;
        },
        toggle(uid) {
            const isActive = this._uid === uid;

            if (isActive) this.isBooted = true;
            this.$nextTick(() => (this.isActive = isActive));
        },
        matchRoute(to) {
            return to.match(this.group) !== null;
        },
    },
    render(h) {
        return h(
            "div",
            this.setTextColor(this.isActive && this.color, {
                staticClass: "o-list-group",
                class: this.classes,
            }),
            [this.genHeader(), h(OExpandTransition, this.genItems())],
        );
    },
});
