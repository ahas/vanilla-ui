import './OPicker.scss';
import '../OCard/OCard.scss';

import Vue from 'vue';

// Mixins
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Themeable from '../../mixins/themeable';
// Helpers
import { convertToUnit } from '../../utils/helpers';

/* @vue/component */
export default Vue.extend({
    name: "OPicker",
    mixins: [Colorable, Elevatable, Themeable],
    props: {
        flat: Boolean,
        fullWidth: Boolean,
        landscape: Boolean,
        noTitle: Boolean,
        transition: {
            type: String,
            default: "fade-transition",
        },
        width: {
            type: [Number, String],
            default: 290,
        },
    },
    computed: {
        computedTitleColor() {
            const defaultTitleColor = this.isDark ? false : this.color || "primary";
            return this.color || defaultTitleColor;
        },
    },
    methods: {
        genTitle() {
            return this.$createElement(
                "div",
                this.setBackgroundColor(this.computedTitleColor, {
                    staticClass: "o-picker__title",
                    class: {
                        "o-picker__title--landscape": this.landscape,
                    },
                }),
                this.$slots.title,
            );
        },
        genBodyTransition() {
            return this.$createElement(
                "transition",
                {
                    props: {
                        name: this.transition,
                    },
                },
                this.$slots.default,
            );
        },
        genBody() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-picker__body",
                    class: {
                        "o-picker__body--no-title": this.noTitle,
                        ...this.themeClasses,
                    },
                    style: this.fullWidth
                        ? undefined
                        : {
                              width: convertToUnit(this.width),
                          },
                },
                [this.genBodyTransition()],
            );
        },
        genActions() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-picker__actions o-card__actions",
                    class: {
                        "o-picker__actions--no-title": this.noTitle,
                    },
                },
                this.$slots.actions,
            );
        },
    },

    render(h) {
        return h(
            "div",
            {
                staticClass: "o-picker o-card",
                class: {
                    "o-picker--flat": this.flat,
                    "o-picker--landscape": this.landscape,
                    "o-picker--full-width": this.fullWidth,
                    ...this.themeClasses,
                    ...this.elevationClasses,
                },
            },
            [this.$slots.title ? this.genTitle() : null, this.genBody(), this.$slots.actions ? this.genActions() : null],
        );
    },
});
