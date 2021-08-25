// Styles
import "./OCalendarCategory.scss";

// Mixins
import OCalendarDaily from "./OCalendarDaily";

// Util
import { convertToUnit, getSlot } from "../../utils/helpers";
import props from "./utils/props";
import { getParsedCategories } from "./utils/parser";

/* @vue/component */
export default OCalendarDaily.extend({
    name: "OCalendarCategory",
    props: props.category,
    computed: {
        classes() {
            return {
                "o-calendar-daily": true,
                "o-calendar-category": true,
                ...this.themeClasses,
            };
        },
        parsedCategories() {
            return getParsedCategories(this.categories, this.categoryText);
        },
    },
    methods: {
        genDayHeader(day, index) {
            const data = {
                staticClass: "o-calendar-category__columns",
            };
            const scope = {
                week: this.days,
                ...day,
                index,
            };

            const children = this.parsedCategories.map((category) => {
                return this.genDayHeaderCategory(day, this.getCategoryScope(scope, category));
            });

            return [this.$createElement("div", data, children)];
        },
        getCategoryScope(scope, category) {
            const cat = typeof category === "object" && category && category.categoryName === this.categoryForInvalid ? null : category;
            return {
                ...scope,
                category: cat,
            };
        },
        genDayHeaderCategory(day, scope) {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-calendar-category__column-header",
                    on: this.getDefaultMouseEventHandlers(":day-category", (e) => {
                        return this.getCategoryScope(this.getSlotScope(day), scope.category);
                    }),
                },
                [
                    getSlot(this, "category", scope) || this.genDayHeaderCategoryTitle(scope.category && scope.category.categoryName),
                    getSlot(this, "day-header", scope),
                ],
            );
        },
        genDayHeaderCategoryTitle(categoryName) {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-calendar-category__category",
                },
                categoryName === null ? this.categoryForInvalid : categoryName,
            );
        },
        genDays() {
            const days = [];
            this.days.forEach((d) => {
                const day = new Array(this.parsedCategories.length || 1);
                day.fill(d);
                days.push(...day.map((v, i) => this.genDay(v, 0, i)));
            });
            return days;
        },
        genDay(day, index, categoryIndex) {
            const category = this.parsedCategories[categoryIndex];
            return this.$createElement(
                "div",
                {
                    key: day.date + "-" + categoryIndex,
                    staticClass: "o-calendar-daily__day",
                    class: this.getRelativeClasses(day),
                    on: this.getDefaultMouseEventHandlers(":time", (e) => {
                        return this.getSlotScope(this.getTimestampAtEvent(e, day));
                    }),
                },
                [...this.genDayIntervals(index, category), ...this.genDayBody(day, category)],
            );
        },
        genDayIntervals(index, category) {
            return this.intervals[index].map((v) => this.genDayInterval(v, category));
        },
        genDayInterval(interval, category) {
            const height = convertToUnit(this.intervalHeight);
            const styler = this.intervalStyle || this.intervalStyleDefault;

            const data = {
                key: interval.time,
                staticClass: "o-calendar-daily__day-interval",
                style: {
                    height,
                    ...styler({ ...interval, category }),
                },
            };

            const children = getSlot(this, "interval", () => this.getCategoryScope(this.getSlotScope(interval), category));

            return this.$createElement("div", data, children);
        },
        genDayBody(day, category) {
            const data = {
                staticClass: "o-calendar-category__columns",
            };

            const children = [this.genDayBodyCategory(day, category)];

            return [this.$createElement("div", data, children)];
        },
        genDayBodyCategory(day, category) {
            const data = {
                staticClass: "o-calendar-category__column",
                on: this.getDefaultMouseEventHandlers(":time-category", (e) => {
                    return this.getCategoryScope(this.getSlotScope(this.getTimestampAtEvent(e, day)), category);
                }),
            };

            const children = getSlot(this, "day-body", () => this.getCategoryScope(this.getSlotScope(day), category));

            return this.$createElement("div", data, children);
        },
    },
});