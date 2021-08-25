import Vue from "vue";

// Styles
import "./OBreadcrumbs.scss";

// Components
import OBreadcrumbsItem from "./OBreadcrumbsItem";
import OBreadcrumbsDivider from "./OBreadcrumbsDivider";

// Mixins
import Themeable from "../../mixins/themeable";

export default Vue.extend({
    name: "OBreadcrumbs",
    mixins: [Themeable],
    props: {
        divider: {
            type: String,
            default: "/",
        },
        items: {
            type: Array,
            default: () => [],
        },
        large: Boolean,
    },
    computed: {
        classes() {
            return {
                "o-breadcrumbs--large": this.large,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genDivider() {
            return this.$createElement(OBreadcrumbsDivider, this.$slots.divider ? this.$slots.divider : this.divider);
        },
        genItems() {
            const items = [];
            const hasSlot = !!this.$scopedSlots.item;
            const keys = [];

            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];

                keys.push(item.text);

                if (hasSlot) items.push(this.$scopedSlots.item({ item }));
                else items.push(this.$createElement(OBreadcrumbsItem, { key: keys.join("."), props: item }, [item.text]));

                if (i < this.items.length - 1) items.push(this.genDivider());
            }

            return items;
        },
    },
    render(h) {
        const children = this.$slots.default || this.genItems();
        return h(
            "ul",
            {
                staticClass: "o-breadcrumbs",
                class: this.classes,
            },
            children,
        );
    },
});
