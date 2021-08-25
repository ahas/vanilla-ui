// Styles
import './OCard.scss';

import Vue from 'vue';

// Mixins
import Loadable from '../../mixins/loadable';
import Routable from '../../mixins/routable';
// Extensions
import OSheet from '../OSheet/OSheet';

/* @vue/component */
export default Vue.extend({
    name: "OCard",
    mixins: [Loadable, Routable, OSheet],
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
                "o-card": true,
                ...Routable.options.computed.classes.call(this),
                "o-card--flat": this.flat,
                "o-card--hover": this.hover,
                "o-card--link": this.isClickable,
                "o-card--loading": this.loading,
                "o-card--disabled": this.disabled,
                "o-card--raised": this.raised,
                ...OSheet.options.computed.classes.call(this),
            };
        },
        styles() {
            const style = {
                ...OSheet.options.computed.styles.call(this),
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
                    staticClass: "o-card__progress",
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
