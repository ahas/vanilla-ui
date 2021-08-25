import Vue from "vue";

// Extensions
import { OBaseSlideGroup } from "../OSlideGroup/OSlideGroup";

// Mixins
import Themeable from "../../mixins/themeable";
import SSRBootable from "../../mixins/ssr-bootable";

export default Vue.extend({
    name: "OTabsBar",
    mixins: [OBaseSlideGroup, SSRBootable, Themeable],
    provide() {
        return {
            tabsBar: this,
        };
    },

    computed: {
        classes() {
            return {
                ...OBaseSlideGroup.options.computed.classes.call(this),
                "o-tabs-bar": true,
                "o-tabs-bar--is-mobile": this.isMobile,
                // TODO: Remove this and move to v-slide-group
                "o-tabs-bar--show-arrows": this.showArrows,
                ...this.themeClasses,
            };
        },
    },
    watch: {
        items: "callSlider",
        internalValue: "callSlider",
        $route: "onRouteChange",
    },
    methods: {
        callSlider() {
            if (!this.isBooted) return;

            this.$emit("call:slider");
        },
        genContent() {
            const render = OBaseSlideGroup.options.methods.genContent.call(this);

            render.data = render.data || {};
            render.data.staticClass += " o-tabs-bar__content";

            return render;
        },
        onRouteChange(val, oldVal) {
            if (this.mandatory) {
                return;
            }

            const items = this.items;
            const newPath = val.path;
            const oldPath = oldVal.path;

            let hasNew = false;
            let hasOld = false;

            for (const item of items) {
                if (item.to === newPath) hasNew = true;
                else if (item.to === oldPath) hasOld = true;

                if (hasNew && hasOld) break;
            }

            // If we have an old item and not a new one
            // it's assumed that the user navigated to
            // a path that is not present in the items
            if (!hasNew && hasOld) this.internalValue = undefined;
        },
    },

    render(h) {
        const render = OBaseSlideGroup.options.render.call(this, h);

        render.data.attrs = {
            role: "tablist",
        };

        return render;
    },
});
