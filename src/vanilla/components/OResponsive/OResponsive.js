import "./OResponsive.scss";
import Vue from "vue";

// Mixins
import Measurable from "../../mixins/measurable";

/* @vue/component */
export default Vue.extend({
    name: "OResponsive",
    mixins: [Measurable],
    props: {
        aspectRatio: [String, Number],
        contentClass: String,
    },
    computed: {
        computedAspectRatio() {
            return Number(this.aspectRatio);
        },
        aspectStyle() {
            return this.computedAspectRatio ? { paddingBottom: (1 / this.computedAspectRatio) * 100 + "%" } : undefined;
        },
        __cachedSizer() {
            if (!this.aspectStyle) return [];

            return this.$createElement("div", {
                style: this.aspectStyle,
                staticClass: "o-responsive__sizer",
            });
        },
    },
    methods: {
        genContent() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-responsive__content",
                    class: this.contentClass,
                },
                this.$slots.default,
            );
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-responsive",
                style: this.measurableStyles,
                on: this.$listeners,
            },
            [this.__cachedSizer, this.genContent()],
        );
    },
});
