import Vue, { VNode } from "vue";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";

// Utils
import { consoleWarn } from "../../utils/console";

export const VBaseItem = Vue.extend({
    props: {
        activeClass: String,
        value: {
            required: false,
        },
    },
    data: () => ({
        isActive: false,
    }),
    methods: {
        toggle() {
            this.isActive = !this.isActive;
        },
    },
    render(): VNode {
        if (!this.$scopedSlots.default) {
            consoleWarn("v-item is missing a default scopedSlot", this);

            return null as any;
        }

        let element;

        if (this.$scopedSlots.default) {
            element = this.$scopedSlots.default({
                active: this.isActive,
                toggle: this.toggle,
            });
        }

        if (Array.isArray(element) && element.length === 1) {
            element = element[0];
        }

        if (!element || Array.isArray(element) || !element.tag) {
            consoleWarn("v-item should only contain a single element", this);

            return element as any;
        }

        element.data = this._b(element.data || {}, element.tag, {
            class: { [this.activeClass]: this.isActive },
        });

        return element;
    },
});

export default Vue.extend({
    name: "v-item",
    mixins: [VBaseItem, GroupableFactory("itemGroup", "v-item", "v-item-group")],
});
