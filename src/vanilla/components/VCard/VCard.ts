// Styles
import "./OCard.scss";

// Mixins
import Loadable from "../../mixins/loadable";
import Routable from "../../mixins/routable";

// Extensions
import VSheet from "../VSheet/VSheet";

// Utilities
import mixins from "../../utils/mixins";

const BaseMixins = mixins(Loadable, Routable, VSheet);

/* @vue/component */
export default BaseMixins.extend({
    name: "OCard",
    props: {
        flat: Boolean,
        hover: Boolean,
        img: String,
        link: Boolean,
        loaderHeight: {
            type: [Number, String],
            default: 4,
        },
        raised: Boolean,
    },
    computed: {
        classes() {
            return {
                "v-card": true,
                ...Routable.options.computed.classes.call(this),
                "v-card--flat": this.flat,
                "v-card--hover": this.hover,
                "v-card--link": this.isClickable,
                "v-card--loading": this.loading,
                "v-card--disabled": this.disabled,
                "v-card--raised": this.raised,
                ...VSheet.options.computed.classes.call(this),
            };
        },
        styles() {
            const style: Dictionary<string> = {
                ...VSheet.options.computed.styles.call(this),
            };

            if (this.img) {
                style.background = `url("${this.img}") center center / cover no-repeat`;
            }

            return style;
        },
    },
    methods: {
        genProgress() {
            const render = Loadable.options.methods.genProgress.call(this);

            if (!render) return null;

            return this.$createElement(
                "div",
                {
                    staticClass: "v-card__progress",
                    key: "progress",
                },
                [render],
            );
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();

        data.style = this.styles;

        if (this.isClickable) {
            data.attrs = data.attrs || {};
            data.attrs.tabindex = 0;
        }

        return h(tag, this.setBackgroundColor(this.color, data), [this.genProgress(), this.$slots.default]);
    },
});
