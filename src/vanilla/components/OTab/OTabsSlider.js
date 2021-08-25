import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";

/* @vue/component */
export default Vue.extend({
    name: "OTabsSlider",
    mixins: [Colorable],
    render(h) {
        return h(
            "div",
            this.setBackgroundColor(this.color, {
                staticClass: "o-tabs-slider",
            }),
        );
    },
});
