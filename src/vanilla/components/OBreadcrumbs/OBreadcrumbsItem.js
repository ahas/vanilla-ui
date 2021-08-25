import Vue from "vue";

// Mixins
import Routable from "../../mixins/routable";

/* @vue/component */
export default Vue.extend({
    name: "OBreadcrumbsItem",
    mixins: [Routable],
    props: {
        // In a breadcrumb, the currently
        // active item should be dimmed
        activeClass: {
            type: String,
            default: "o-breadcrumbs__item--disabled",
        },
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                "o-breadcrumbs__item": true,
                [this.activeClass]: this.disabled,
            };
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();

        return h("li", [
            h(
                tag,
                {
                    ...data,
                    attrs: {
                        ...data.attrs,
                        "aria-current": this.isActive && this.isLink ? "page" : undefined,
                    },
                },
                this.$slots.default,
            ),
        ]);
    },
});
