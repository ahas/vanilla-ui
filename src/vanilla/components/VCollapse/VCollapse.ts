// Styles
import "./VExpansionPanel.sass";

// Components
import { BaseItemGroup, GroupableInstance } from "../VItemGroup/VItemGroup";
import VExpansionPanel from "./VCollapseItem";

// Utilities
import { breaking } from "../../utils/console";

// Types
interface VCollapseItemInstance extends InstanceType<typeof VExpansionPanel> {}

/* @vue/component */
export default BaseItemGroup.extend({
    name: "v-collapse",
    provide(): object {
        return {
            collapse: this,
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
        classes(): object {
            return {
                ...BaseItemGroup.options.computed.classes.call(this),
                "v-collapse": true,
                "v-collapse--accordion": this.accordion,
                "v-collapse--flat": this.flat,
                "v-collapse--hover": this.hover,
                "v-collapse--focusable": this.focusable,
                "v-collapse--inset": this.inset,
                "v-collapse--popout": this.popout,
                "v-collapse--tile": this.tile,
            };
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty("expand")) {
            breaking("expand", "multiple", this);
        }

        /* istanbul ignore next */
        if (Array.isArray(this.value) && this.value.length > 0 && typeof this.value[0] === "boolean") {
            breaking(':value="[true, false, true]"', ':value="[0, 2]"', this);
        }
    },
    methods: {
        updateItem(item: GroupableInstance & VCollapseItemInstance, index: number) {
            const value = this.getValue(item, index);
            const nextValue = this.getValue(item, index + 1);

            item.isActive = this.toggleMethod(value);
            item.nextIsActive = this.toggleMethod(nextValue);
        },
    },
});
