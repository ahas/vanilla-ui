import Vue from "vue";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";

// Utils
import { consoleWarn } from "../../utils/console";

export const OBaseItem = Vue.extend({
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
    render() {
        if (!this.$scopedSlots.default) {
            consoleWarn("o-item is missing a default scopedSlot", this);

            return null;
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
            consoleWarn("o-item should only contain a single element", this);

            return element;
        }

        element.data = this._b(element.data || {}, element.tag, {
            class: { [this.activeClass]: this.isActive },
        });

        return element;
    },
});

export default Vue.extend({
    name: "o-item",
    mixins: [OBaseItem, GroupableFactory("itemGroup", "o-item", "o-item-group")],
});
