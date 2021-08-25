// Styles
import "./OTabs.scss";
import Vue from "vue";

// Components
import OTabsBar from "./OTabsBar";
import OTabsItems from "./OTabsItems";
import OTabsSlider from "./OTabsSlider";

// Mixins
import Colorable from "../../mixins/colorable";
import Proxyable from "../../mixins/proxyable";
import Themeable from "../../mixins/themeable";

// Directives
import Resize from "../../directives/resize";

// Utils
import { convertToUnit } from "../../utils/helpers";

export default Vue.extend({
    name: "OTabs",
    mixins: [Colorable, Proxyable, Themeable],
    directives: {
        Resize,
    },
    props: {
        activeClass: {
            type: String,
            default: "",
        },
        alignWithTitle: Boolean,
        backgroundColor: String,
        centerActive: Boolean,
        centered: Boolean,
        fixedTabs: Boolean,
        grow: Boolean,
        height: {
            type: [Number, String],
            default: undefined,
        },
        hideSlider: Boolean,
        iconsAndText: Boolean,
        mobileBreakpoint: [String, Number],
        nextIcon: {
            type: String,
            default: "mdi-chevron-right",
        },
        optional: Boolean,
        prevIcon: {
            type: String,
            default: "mdi-chevron-left",
        },
        right: Boolean,
        showArrows: [Boolean, String],
        sliderColor: String,
        sliderSize: {
            type: [Number, String],
            default: 2,
        },
        vertical: Boolean,
    },
    data() {
        return {
            resizeTimeout: 0,
            slider: {
                height: null,
                left: null,
                right: null,
                top: null,
                width: null,
            },
            transitionTime: 300,
        };
    },
    computed: {
        classes() {
            return {
                "o-tabs--align-with-title": this.alignWithTitle,
                "o-tabs--centered": this.centered,
                "o-tabs--fixed-tabs": this.fixedTabs,
                "o-tabs--grow": this.grow,
                "o-tabs--icons-and-text": this.iconsAndText,
                "o-tabs--right": this.right,
                "o-tabs--vertical": this.vertical,
                ...this.themeClasses,
            };
        },
        isReversed() {
            return this.$vanilla.rtl && this.vertical;
        },
        sliderStyles() {
            return {
                height: convertToUnit(this.slider.height),
                left: this.isReversed ? undefined : convertToUnit(this.slider.left),
                right: this.isReversed ? convertToUnit(this.slider.right) : undefined,
                top: this.vertical ? convertToUnit(this.slider.top) : undefined,
                transition: this.slider.left != null ? null : "none",
                width: convertToUnit(this.slider.width),
            };
        },
        computedColor() {
            if (this.color) return this.color;
            else if (this.isDark && !this.appIsDark) return "white";
            else return "primary";
        },
    },
    watch: {
        alignWithTitle: "callSlider",
        centered: "callSlider",
        centerActive: "callSlider",
        fixedTabs: "callSlider",
        grow: "callSlider",
        iconsAndText: "callSlider",
        right: "callSlider",
        showArrows: "callSlider",
        vertical: "callSlider",
        "$vanilla.application.left": "onResize",
        "$vanilla.application.right": "onResize",
        "$vanilla.rtl": "onResize",
    },
    mounted() {
        this.$nextTick(() => {
            window.setTimeout(this.callSlider, 30);
        });
    },
    methods: {
        callSlider() {
            if (this.hideSlider || !this.$refs.items || !this.$refs.items.selectedItems.length) {
                this.slider.width = 0;
                return false;
            }

            this.$nextTick(() => {
                // Give screen time to paint
                const activeTab = this.$refs.items.selectedItems[0];

                if (!activeTab || !activeTab.$el) {
                    this.slider.width = 0;
                    this.slider.left = 0;
                    return;
                }
                const el = activeTab.$el;

                this.slider = {
                    height: !this.vertical ? Number(this.sliderSize) : el.scrollHeight,
                    left: this.vertical ? 0 : el.offsetLeft,
                    right: this.vertical ? 0 : el.offsetLeft + el.offsetWidth,
                    top: el.offsetTop,
                    width: this.vertical ? Number(this.sliderSize) : el.scrollWidth,
                };
            });

            return true;
        },
        genBar(items, slider) {
            const data = {
                style: {
                    height: convertToUnit(this.height),
                },
                props: {
                    activeClass: this.activeClass,
                    centerActive: this.centerActive,
                    dark: this.dark,
                    light: this.light,
                    mandatory: !this.optional,
                    mobileBreakpoint: this.mobileBreakpoint,
                    nextIcon: this.nextIcon,
                    prevIcon: this.prevIcon,
                    showArrows: this.showArrows,
                    value: this.internalValue,
                },
                on: {
                    "call:slider": this.callSlider,
                    change: (val) => {
                        this.internalValue = val;
                    },
                },
                ref: "items",
            };

            this.setTextColor(this.computedColor, data);
            this.setBackgroundColor(this.backgroundColor, data);

            return this.$createElement(OTabsBar, data, [this.genSlider(slider), items]);
        },
        genItems(items, item) {
            // If user provides items
            // opt to use theirs
            if (items) return items;

            // If no tabs are provided
            // render nothing
            if (!item.length) return null;

            return this.$createElement(
                OTabsItems,
                {
                    props: {
                        value: this.internalValue,
                    },
                    on: {
                        change: (val) => {
                            this.internalValue = val;
                        },
                    },
                },
                item,
            );
        },
        genSlider(slider) {
            if (this.hideSlider) return null;

            if (!slider) {
                slider = this.$createElement(OTabsSlider, {
                    props: { color: this.sliderColor },
                });
            }

            return this.$createElement(
                "div",
                {
                    staticClass: "o-tabs-slider-wrapper",
                    style: this.sliderStyles,
                },
                [slider],
            );
        },
        onResize() {
            if (this._isDestroyed) return;

            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(this.callSlider, 0);
        },
        parseNodes() {
            let items = null;
            let slider = null;
            const item = [];
            const tab = [];
            const slot = this.$slots.default || [];
            const length = slot.length;

            for (let i = 0; i < length; i++) {
                const vnode = slot[i];

                if (vnode.componentOptions) {
                    switch (vnode.componentOptions.Ctor.options.name) {
                        case "o-tabs-slider":
                            slider = vnode;
                            break;
                        case "o-tabs-items":
                            items = vnode;
                            break;
                        case "v-tab-item":
                            item.push(vnode);
                            break;
                        // case 'v-tab' - intentionally omitted
                        default:
                            tab.push(vnode);
                    }
                } else {
                    tab.push(vnode);
                }
            }

            /**
             * tab: array of `v-tab`
             * slider: single `o-tabs-slider`
             * items: single `o-tabs-items`
             * item: array of `v-tab-item`
             */
            return { tab, slider, items, item };
        },
    },
    render(h) {
        const { tab, slider, items, item } = this.parseNodes();

        return h(
            "div",
            {
                staticClass: "o-tabs",
                class: this.classes,
                directives: [
                    {
                        name: "resize",
                        modifiers: { quiet: true },
                        value: this.onResize,
                    },
                ],
            },
            [this.genBar(tab, slider), this.genItems(items, item)],
        );
    },
});
