// Types
import Vue from "vue";

export default Vue.extend({
    name: "OListItemIcon",
    functional: true,
    render(h, { data, children }) {
        data.staticClass = `o-list-item__icon ${data.staticClass || ""}`.trim();

        return h("div", data, children);
    },
});
