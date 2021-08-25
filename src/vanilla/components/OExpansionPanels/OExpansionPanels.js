// Styles
import "./OExpansionPanel.scss";

// Components
import { BaseItemGroup } from "../OItemGroup/OItemGroup";

// Utilities
import { breaking } from "../../utils/console";

/* @vue/component */
export default BaseItemGroup.extend({
    name: "OExpansionPanels",
    provide() {
        return {
            expansionPanels: this,
        };
    },
    props: {
        accordion: Boolean,
        disabled: Boolean,
        flat: Boolean,
        hover: Boolean,
        focusable: Boolean,
        inset: Boolean,
        popout: Boolean,
        readonly: Boolean,
        tile: Boolean,
    },
    computed: {
        classes() {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                "o-expansion-panels": true,
                "o-expansion-panels--accordion": this.accordion,
                "o-expansion-panels--flat": this.flat,
                "o-expansion-panels--hover": this.hover,
                "o-expansion-panels--focusable": this.focusable,
                "o-expansion-panels--inset": this.inset,
                "o-expansion-panels--popout": this.popout,
                "o-expansion-panels--tile": this.tile,
            };
        },
    },
    created() {
        if (this.$attrs.hasOwnProperty("expand")) {
            breaking("expand", "multiple", this);
        }

        if (Array.isArray(this.value) && this.value.length > 0 && typeof this.value[0] === "boolean") {
            breaking(':value="[true, false, true]"', ':value="[0, 2]"', this);
        }
    },
    methods: {
        updateItem(item, index) {
            const value = this.getValue(item, index);
            const nextValue = this.getValue(item, index + 1);

            item.isActive = this.toggleMethod(value);
            item.nextIsActive = this.toggleMethod(nextValue);
        },
    },
});
