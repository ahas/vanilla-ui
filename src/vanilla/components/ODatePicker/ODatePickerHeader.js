import "./ODatePickerHeader.scss";

import Vue from "vue";

// Mixins
import Colorable from "../../mixins/colorable";
import Localable from "../../mixins/localable";
import Themeable from "../../mixins/themeable";
// Components
import OBtn from "../OBtn/OBtn";
import OIcon from "../OIcon/OIcon";
// Utils
import { createNativeLocaleFormatter, monthChange } from "./utils";

export default Vue.extend({
    name: "ODatePickerHeader",
    mixins: [Colorable, Localable, Themeable],
    props: {
        disabled: Boolean,
        format: Function,
        min: String,
        max: String,
        nextAriaLabel: String,
        nextIcon: {
            type: String,
            default: "mdi-chevron-right",
        },
        prevAriaLabel: String,
        prevIcon: {
            type: String,
            default: "mdi-chevron-left",
        },
        readonly: Boolean,
        value: {
            type: [Number, String],
            required: true,
        },
    },
    data() {
        return {
            isReversing: false,
        };
    },
    computed: {
        formatter() {
            if (this.format) {
                return this.format;
            } else if (String(this.value).split("-")[1]) {
                return createNativeLocaleFormatter(this.currentLocale, { month: "long", year: "numeric", timeZone: "UTC" }, { length: 7 });
            } else {
                return createNativeLocaleFormatter(this.currentLocale, { year: "numeric", timeZone: "UTC" }, { length: 4 });
            }
        },
    },

    watch: {
        value(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        },
    },

    methods: {
        genBtn(change) {
            const ariaLabelId = change > 0 ? this.nextAriaLabel : this.prevAriaLabel;
            const ariaLabel = ariaLabelId ? this.$t(ariaLabelId) : undefined;
            const disabled =
                this.disabled ||
                (change < 0 && this.min && this.calculateChange(change) < this.min) ||
                (change > 0 && this.max && this.calculateChange(change) > this.max);

            return this.$createElement(
                OBtn,
                {
                    attrs: { "aria-label": ariaLabel },
                    props: {
                        dark: this.dark,
                        disabled,
                        icon: true,
                        light: this.light,
                    },
                    on: {
                        click: (e) => {
                            e.stopPropagation();
                            this.$emit("input", this.calculateChange(change));
                        },
                    },
                },
                [this.$createElement(OIcon, change < 0 === !this.$vanilla.rtl ? this.prevIcon : this.nextIcon)],
            );
        },
        calculateChange(sign) {
            const [year, month] = String(this.value).split("-").map(Number);

            if (month == null) {
                return `${year + sign}`;
            } else {
                return monthChange(String(this.value), sign);
            }
        },
        genHeader() {
            const color = !this.disabled && (this.color || "accent");
            const header = this.$createElement(
                "div",
                this.setTextColor(color, {
                    key: String(this.value),
                }),
                [
                    this.$createElement(
                        "button",
                        {
                            attrs: {
                                type: "button",
                            },
                            on: {
                                click: () => this.$emit("toggle"),
                            },
                        },
                        [this.$slots.default || this.formatter(String(this.value))],
                    ),
                ],
            );

            const transition = this.$createElement(
                "transition",
                {
                    props: {
                        name: this.isReversing === !this.$vanilla.rtl ? "tab-reverse-transition" : "tab-transition",
                    },
                },
                [header],
            );

            return this.$createElement(
                "div",
                {
                    staticClass: "o-date-picker-header__value",
                    class: {
                        "o-date-picker-header__value--disabled": this.disabled,
                    },
                },
                [transition],
            );
        },
    },
    render() {
        return this.$createElement(
            "div",
            {
                staticClass: "o-date-picker-header",
                class: {
                    "o-date-picker-header--disabled": this.disabled,
                    ...this.themeClasses,
                },
            },
            [this.genBtn(-1), this.genHeader(), this.genBtn(+1)],
        );
    },
});
