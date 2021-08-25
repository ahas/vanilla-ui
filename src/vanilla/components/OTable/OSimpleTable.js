import "./OSimpleTable.scss";

import Vue from "vue";
import { convertToUnit } from "../../utils/helpers";
import Themeable from "../../mixins/themeable";

export default Vue.extend({
    name: "OSimpleTable",
    mixins: [Themeable],
    props: {
        dense: Boolean,
        fixedHeader: Boolean,
        height: [Number, String],
    },
    computed: {
        classes() {
            return {
                "o-table--dense": this.dense,
                "o-table--fixed-height": !!this.height && !this.fixedHeader,
                "o-table--fixed-header": this.fixedHeader,
                "o-table--has-top": !!this.$slots.top,
                "o-table--has-bottom": !!this.$slots.bottom,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genWrapper() {
            return (
                this.$slots.wrapper ||
                this.$createElement(
                    "div",
                    {
                        staticClass: "o-table__wrapper",
                        style: {
                            height: convertToUnit(this.height),
                        },
                    },
                    [this.$createElement("table", this.$slots.default)],
                )
            );
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-table",
                class: this.classes,
            },
            [this.$slots.top, this.genWrapper(), this.$slots.bottom],
        );
    },
});
