// Components
import OIcon from "../OIcon/OIcon";
import OBtn from "../OBtn/OBtn";

// Types
import Vue from "vue";

/* @vue/component */
export default Vue.extend({
    name: "OAppBarNavIcon",
    functional: true,
    render(h, { slots, listeners, props, data }) {
        const d = Object.assign(data, {
            staticClass: `o-app-bar__nav-icon ${data.staticClass || ""}`.trim(),
            props: {
                ...props,
                icon: true,
            },
            on: listeners,
        });

        const defaultSlot = slots().default;

        return h(OBtn, d, defaultSlot || [h(OIcon, "mdi-menu")]);
    },
});
