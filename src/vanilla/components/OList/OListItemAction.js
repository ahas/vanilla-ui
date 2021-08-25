// Types
import Vue from "vue";

export default Vue.extend({
    name: "OListItemAction",
    functional: true,
    render(h, { data, children = [] }) {
        data.staticClass = data.staticClass ? `o-list-item__action ${data.staticClass}` : "o-list-item__action";
        const filteredChild = children.filter((VNode) => {
            return VNode.isComment === false && VNode.text !== " ";
        });
        if (filteredChild.length > 1) data.staticClass += " o-list-item__action--stack";

        return h("div", data, children);
    },
});
