import Vue from "vue";

import "../ODatePickerTable.scss";

// Directives
import Touch from "../../../directives/touch";

// Mixins
import Colorable from "../../../mixins/colorable";
import Localable from "../../../mixins/localable";
import Themeable from "../../../mixins/themeable";

// Utils
import { createItemTypeNativeListeners, sanitizeDateString } from "../utils";
import isDateAllowed from "../utils/is-date-allowed";
import { mergeListeners } from "../../../utils/merge-data";
import { throttle } from "../../../utils/helpers";

export default Vue.extend({
    directives: { Touch },
    mixins: [Colorable, Localable, Themeable],
    props: {
        allowedDates: Function,
        current: String,
        disabled: Boolean,
        format: Function,
        events: {
            type: [Array, Function, Object],
            default: () => null,
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => "warning",
        },
        min: String,
        max: String,
        range: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        tableDate: {
            type: String,
            required: true,
        },
        value: [String, Array],
    },
    data: () => ({
        isReversing: false,
        wheelThrottle: null,
    }),
    computed: {
        computedTransition() {
            return this.isReversing === !this.$vanilla.rtl ? "tab-reverse-transition" : "tab-transition";
        },
        displayedMonth() {
            return Number(this.tableDate.split("-")[1]) - 1;
        },
        displayedYear() {
            return Number(this.tableDate.split("-")[0]);
        },
    },
    watch: {
        tableDate(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        },
    },
    mounted() {
        this.wheelThrottle = throttle(this.wheel, 250);
    },
    methods: {
        genButtonClasses(isAllowed, isFloating, isSelected, isCurrent) {
            return {
                "o-size--default": !isFloating,
                "o-date-picker-table__current": isCurrent,
                "o-btn--active": isSelected,
                "o-btn--flat": !isAllowed || this.disabled,
                "o-btn--text": isSelected === isCurrent,
                "o-btn--rounded": isFloating,
                "o-btn--disabled": !isAllowed || this.disabled,
                "o-btn--outlined": isCurrent && !isSelected,
                ...this.themeClasses,
            };
        },
        genButtonEvents(value, isAllowed, mouseEventType) {
            if (this.disabled) {
                return undefined;
            }

            return mergeListeners(
                {
                    click: () => {
                        if (isAllowed && !this.readonly) {
                            this.$emit("input", value);
                        }
                    },
                },
                createItemTypeNativeListeners(this, `:${mouseEventType}`, value),
            );
        },
        genButton(value, isFloating, mouseEventType, formatter, isOtherMonth = false) {
            const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates);
            const isSelected = this.isSelected(value) && isAllowed;
            const isCurrent = value === this.current;
            const setColor = isSelected ? this.setBackgroundColor : this.setTextColor;
            const color = (isSelected || isCurrent) && (this.color || "accent");

            return this.$createElement(
                "button",
                setColor(color, {
                    staticClass: "o-btn",
                    class: this.genButtonClasses(isAllowed && !isOtherMonth, isFloating, isSelected, isCurrent),
                    attrs: {
                        type: "button",
                    },
                    domProps: {
                        disabled: this.disabled || !isAllowed || isOtherMonth,
                    },
                    on: this.genButtonEvents(value, isAllowed, mouseEventType),
                }),
                [
                    this.$createElement(
                        "div",
                        {
                            staticClass: "o-btn__content",
                        },
                        [formatter(value)],
                    ),
                    this.genEvents(value),
                ],
            );
        },
        getEventColors(date) {
            const arrayize = (v) => (Array.isArray(v) ? v : [v]);
            let eventData;
            let eventColors;

            if (Array.isArray(this.events)) {
                eventData = this.events.includes(date);
            } else if (this.events instanceof Function) {
                eventData = this.events(date) || false;
            } else if (this.events) {
                eventData = this.events[date] || false;
            } else {
                eventData = false;
            }

            if (!eventData) {
                return [];
            } else if (eventData !== true) {
                eventColors = arrayize(eventData);
            } else if (typeof this.eventColor === "string") {
                eventColors = [this.eventColor];
            } else if (typeof this.eventColor === "function") {
                eventColors = arrayize(this.eventColor(date));
            } else if (Array.isArray(this.eventColor)) {
                eventColors = this.eventColor;
            } else {
                eventColors = arrayize(this.eventColor[date]);
            }

            return eventColors.filter((v) => v);
        },
        genEvents(date) {
            const eventColors = this.getEventColors(date);

            return eventColors.length
                ? this.$createElement(
                      "div",
                      {
                          staticClass: "o-date-picker-table__events",
                      },
                      eventColors.map((color) => this.$createElement("div", this.setBackgroundColor(color))),
                  )
                : null;
        },
        isValidScroll(e, calculateTableDate) {
            const tableDate = calculateTableDate(e.deltaY);
            // tableDate is 'YYYY-MM' for DateTable and 'YYYY' for MonthTable
            const sanitizeType = tableDate.split("-").length === 1 ? "year" : "month";
            return (
                e.deltaY === 0 ||
                (e.deltaY < 0 && (this.min ? tableDate >= sanitizeDateString(this.min, sanitizeType) : true)) ||
                (e.deltaY > 0 && (this.max ? tableDate <= sanitizeDateString(this.max, sanitizeType) : true))
            );
        },
        wheel(e, calculateTableDate) {
            this.$emit("update:table-date", calculateTableDate(e.deltaY));
        },
        touch(value, calculateTableDate) {
            this.$emit("update:table-date", calculateTableDate(value));
        },
        genTable(staticClass, children, calculateTableDate) {
            const transition = this.$createElement(
                "transition",
                {
                    props: { name: this.computedTransition },
                },
                [this.$createElement("table", { key: this.tableDate }, children)],
            );

            const touchDirective = {
                name: "touch",
                value: {
                    left: (e) => e.offsetX < -15 && this.touch(1, calculateTableDate),
                    right: (e) => e.offsetX > 15 && this.touch(-1, calculateTableDate),
                },
            };

            return this.$createElement(
                "div",
                {
                    staticClass,
                    class: {
                        "o-date-picker-table--disabled": this.disabled,
                        ...this.themeClasses,
                    },
                    on:
                        !this.disabled && this.scrollable
                            ? {
                                  wheel: (e) => {
                                      e.preventDefault();
                                      if (this.isValidScroll(e, calculateTableDate)) {
                                          this.wheelThrottle(e, calculateTableDate);
                                      }
                                  },
                              }
                            : undefined,
                    directives: [touchDirective],
                },
                [transition],
            );
        },
        isSelected(value) {
            if (Array.isArray(this.value)) {
                if (this.range && this.value.length === 2) {
                    const [from, to] = [...this.value].sort();
                    return from <= value && value <= to;
                } else {
                    return this.value.indexOf(value) !== -1;
                }
            }

            return value === this.value;
        },
    },
});
