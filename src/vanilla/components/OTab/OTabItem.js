// Extensions
import OWindowItem from "../OWindow/OWindowItem";

/* @vue/component */
export default OWindowItem.extend({
    name: "OTabItem",
    props: {
        id: String,
    },
    methods: {
        genWindowItem() {
            const item = OWindowItem.options.methods.genWindowItem.call(this);

            item.data.domProps = item.data.domProps || {};
            item.data.domProps.id = this.id || this.value;

            return item;
        },
    },
});
