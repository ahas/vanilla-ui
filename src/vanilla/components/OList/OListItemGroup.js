import "./OListItemGroup.scss";
import Vue from "vue";

// Extensions
import { BaseItemGroup } from "../OItemGroup/OItemGroup";

// Mixins
import Colorable from "../../mixins/colorable";

export default Vue.extend({
    name: "OListItemGroup",
    mixins: [BaseItemGroup, Colorable],
    provide() {
        return {
            isInGroup: true,
            listItemGroup: this,
        };
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                "o-list-item-group": true,
            };
        },
    },
    methods: {
        genData() {
            return this.setTextColor(this.color, {
                ...BaseItemGroup.options.methods.genData.call(this),
                attrs: {
                    role: "listbox",
                },
            });
        },
    },
});
