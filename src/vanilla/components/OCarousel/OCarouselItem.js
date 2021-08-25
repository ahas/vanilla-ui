import Vue from "vue";

// Extensions
import OWindowItem from "../OWindow/OWindowItem";

// Components
import { OImg } from "../OImg";

// Utils
import { getSlot } from "../../utils/helpers";
import Routable from "../../mixins/routable";

/* @vue/component */
export default Vue.extend({
    name: "OCarouselItem",
    mixins: [OWindowItem, Routable],
    inheritAttrs: false,
    methods: {
        genDefaultSlot() {
            return [
                this.$createElement(
                    OImg,
                    {
                        staticClass: "o-carousel__item",
                        props: {
                            ...this.$attrs,
                            height: this.windowGroup.internalHeight,
                        },
                        on: this.$listeners,
                        scopedSlots: {
                            placeholder: this.$scopedSlots.placeholder,
                        },
                    },
                    getSlot(this),
                ),
            ];
        },
        genWindowItem() {
            const { tag, data } = this.generateRouteLink();

            data.staticClass = "o-window-item";
            data.directives.push({
                name: "show",
                value: this.isActive,
            });

            return this.$createElement(tag, data, this.genDefaultSlot());
        },
    },
});
