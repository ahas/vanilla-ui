import Vue from "vue";

import "./ODatePickerTitle.scss";

// Components
import OIcon from "../OIcon/OIcon";

// Mixins
import PickerButton from "../../mixins/picker-button";

export default Vue.extend({
    name: "ODatePickerTitle",
    mixins: [PickerButton],
    props: {
        date: {
            type: String,
            default: "",
        },
        disabled: Boolean,
        readonly: Boolean,
        selectingYear: Boolean,
        value: {
            type: String,
        },
        year: {
            type: [Number, String],
            default: "",
        },
        yearIcon: {
            type: String,
        },
    },
    data: () => ({
        isReversing: false,
    }),
    computed: {
        computedTransition() {
            return this.isReversing ? "picker-reverse-transition" : "picker-transition";
        },
    },
    watch: {
        value(val, prev) {
            this.isReversing = val < prev;
        },
    },
    methods: {
        genYearIcon() {
            return this.$createElement(
                OIcon,
                {
                    props: {
                        dark: true,
                    },
                },
                this.yearIcon,
            );
        },
        getYearBtn() {
            return this.genPickerButton(
                "selectingYear",
                true,
                [String(this.year), this.yearIcon ? this.genYearIcon() : null],
                false,
                "o-date-picker-title__year",
            );
        },
        genTitleText() {
            return this.$createElement(
                "transition",
                {
                    props: {
                        name: this.computedTransition,
                    },
                },
                [
                    this.$createElement("div", {
                        domProps: { innerHTML: this.date || "&nbsp;" },
                        key: this.value,
                    }),
                ],
            );
        },
        genTitleDate() {
            return this.genPickerButton("selectingYear", false, [this.genTitleText()], false, "o-date-picker-title__date");
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-date-picker-title",
                class: {
                    "o-date-picker-title--disabled": this.disabled,
                },
            },
            [this.getYearBtn(), this.genTitleDate()],
        );
    },
});
