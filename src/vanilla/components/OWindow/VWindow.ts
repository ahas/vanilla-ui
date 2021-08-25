// Styles
import "./VWindow.scss";

// Directives
import Touch from "../../directives/touch";
// Components
import VBtn from "../VBtn/VBtn";
import VIcon from "../VIcon/VIcon";
import { BaseItemGroup } from "../VItemGroup/VItemGroup";

/* @vue/component */
export default BaseItemGroup.extend({
    name: "VWindow",
    directives: { Touch },
    provide() {
        return {
            windowGroup: this,
        };
    },
    props: {
        activeClass: {
            type: String,
            default: "v-window-item--active",
        },
        continuous: Boolean,
        mandatory: {
            type: Boolean,
            default: true,
        },
        nextIcon: {
            type: [Boolean, String],
            default: "mdi-chevron-right",
        },
        prevIcon: {
            type: [Boolean, String],
            default: "mdi-chevron-left",
        },
        reverse: Boolean,
        showArrows: Boolean,
        showArrowsOnHover: Boolean,
        touch: Object,
        touchless: Boolean,
        value: {
            required: false,
        },
        vertical: Boolean,
    },
    data() {
        return {
            changedByDelimiters: false,
            internalHeight: undefined, // This can be fixed by child class.
            transitionHeight: undefined, // Intermediate height during transition.
            transitionCount: 0, // Number of windows in transition state.
            isBooted: false,
            isReverse: false,
        };
    },
    computed: {
        isActive() {
            return this.transitionCount > 0;
        },
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                "v-window--show-arrows-on-hover": this.showArrowsOnHover,
            };
        },
        computedTransition() {
            if (!this.isBooted) {
                return "";
            }

            const axis = this.vertical ? "y" : "x";
            const reverse = this.internalReverse ? !this.isReverse : this.isReverse;
            const direction = reverse ? "-reverse" : "";

            return `v-window-${axis}${direction}-transition`;
        },
        hasActiveItems() {
            return Boolean(this.items.find((item) => !item.disabled));
        },
        hasNext() {
            return this.continuous || this.internalIndex < this.items.length - 1;
        },
        hasPrev() {
            return this.continuous || this.internalIndex > 0;
        },
        internalIndex() {
            return this.items.findIndex((item, i) => {
                return this.internalValue === this.getValue(item, i);
            });
        },
        internalReverse() {
            return this.$vanilla.rtl ? !this.reverse : this.reverse;
        },
    },

    watch: {
        internalIndex(val, oldVal) {
            this.isReverse = this.updateReverse(val, oldVal);
        },
    },

    mounted() {
        window.requestAnimationFrame(() => (this.isBooted = true));
    },

    methods: {
        genContainer() {
            const children = [this.$slots.default];

            if (this.showArrows) {
                children.push(this.genControlIcons());
            }

            return this.$createElement(
                "div",
                {
                    staticClass: "v-window__container",
                    class: {
                        "v-window__container--is-active": this.isActive,
                    },
                    style: {
                        height: this.internalHeight || this.transitionHeight,
                    },
                },
                children,
            );
        },
        genIcon(direction, icon, click) {
            const on = {
                click: (e) => {
                    e.stopPropagation();
                    this.changedByDelimiters = true;
                    click();
                },
            };
            const attrs = {
                "aria-label": this.$t(`$vanilla.carousel.${direction}`),
            };
            const children = this.$scopedSlots[direction]?.({
                on,
                attrs,
            }) ?? [
                this.$createElement(
                    OBtn,
                    {
                        props: { icon: true },
                        attrs,
                        on,
                    },
                    [
                        this.$createElement(
                            OIcon,
                            {
                                props: { large: true },
                            },
                            icon,
                        ),
                    ],
                ),
            ];

            return this.$createElement(
                "div",
                {
                    staticClass: `v-window__${direction}`,
                },
                children,
            );
        },
        genControlIcons() {
            const icons = [];

            const prevIcon = this.$vanilla.rtl ? this.nextIcon : this.prevIcon;

            if (this.hasPrev && prevIcon && typeof prevIcon === "string") {
                const icon = this.genIcon("prev", prevIcon, this.prev);
                icon && icons.push(icon);
            }

            const nextIcon = this.$vanilla.rtl ? this.prevIcon : this.nextIcon;

            if (this.hasNext && nextIcon && typeof nextIcon === "string") {
                const icon = this.genIcon("next", nextIcon, this.next);
                icon && icons.push(icon);
            }

            return icons;
        },
        getNextIndex(index) {
            const nextIndex = (index + 1) % this.items.length;
            const item = this.items[nextIndex];

            if (item.disabled) return this.getNextIndex(nextIndex);

            return nextIndex;
        },
        getPrevIndex(index) {
            const prevIndex = (index + this.items.length - 1) % this.items.length;
            const item = this.items[prevIndex];

            if (item.disabled) return this.getPrevIndex(prevIndex);

            return prevIndex;
        },
        next() {
            if (!this.hasActiveItems || !this.hasNext) return;

            const nextIndex = this.getNextIndex(this.internalIndex);
            const item = this.items[nextIndex];

            this.internalValue = this.getValue(item, nextIndex);
        },
        prev() {
            if (!this.hasActiveItems || !this.hasPrev) return;

            const lastIndex = this.getPrevIndex(this.internalIndex);
            const item = this.items[lastIndex];

            this.internalValue = this.getValue(item, lastIndex);
        },
        updateReverse(val, oldVal) {
            const itemsLength = this.items.length;
            const lastIndex = itemsLength - 1;

            if (itemsLength <= 2) return val < oldVal;

            if (val === lastIndex && oldVal === 0) {
                return true;
            } else if (val === 0 && oldVal === lastIndex) {
                return false;
            } else {
                return val < oldVal;
            }
        },
    },

    render(h) {
        const data = {
            staticClass: "v-window",
            class: this.classes,
            directives: [],
        };

        if (!this.touchless) {
            const value = this.touch || {
                left: () => {
                    this.$vanilla.rtl ? this.prev() : this.next();
                },
                right: () => {
                    this.$vanilla.rtl ? this.next() : this.prev();
                },
                end: (e) => {
                    e.stopPropagation();
                },
                start: (e) => {
                    e.stopPropagation();
                },
            };

            data.directives.push({
                name: "touch",
                value,
            });
        }

        return h("div", data, [this.genContainer()]);
    },
});
