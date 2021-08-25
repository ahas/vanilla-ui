// Extensions
import OWindow from "../OWindow/OWindow";

// Types & Components
import { BaseItemGroup } from "../OItemGroup/OItemGroup";

/* @vue/component */
export default OWindow.extend({
    name: "OTabsItems",
    props: {
        mandatory: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                ...OWindow.options.computed.classes.call(this),
                "o-tabs-items": true,
            };
        },
        isDark() {
            return this.rootIsDark;
        },
    },
    methods: {
        getValue(item, i) {
            return item.id || BaseItemGroup.options.methods.getValue.call(this, item, i);
        },
    },
});
