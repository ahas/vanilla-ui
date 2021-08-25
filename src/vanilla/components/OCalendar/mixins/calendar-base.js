import Vue from "vue";

// Mixins
import Colorable from "../../../mixins/colorable";
import Localable from "../../../mixins/localable";
import Mouse from "./mouse";
import Themeable from "../../../mixins/themeable";
import Times from "./times";

// Directives
import Resize from "../../../directives/resize";

// Utils
import props from "../utils/props";
import {
    parseTimestamp,
    getWeekdaySkips,
    createDayList,
    createNativeLocaleFormatter,
    getStartOfWeek,
    getEndOfWeek,
    getTimestampIdentifier,
} from "../utils/timestamp";

export default Vue.extend({
    name: "calendar-base",
    mixins: [Colorable, Localable, Mouse, Themeable, Times],
    directives: {
        Resize,
    },
    props: props.base,
    computed: {
        parsedWeekdays() {
            return Array.isArray(this.weekdays) ? this.weekdays : (this.weekdays || "").split(",").map((x) => parseInt(x, 10));
        },
        weekdaySkips() {
            return getWeekdaySkips(this.parsedWeekdays);
        },
        weekdaySkipsReverse() {
            const reversed = this.weekdaySkips.slice();
            reversed.reverse();
            return reversed;
        },
        parsedStart() {
            return parseTimestamp(this.start, true);
        },
        parsedEnd() {
            const start = this.parsedStart;
            const end = this.end ? parseTimestamp(this.end) || start : start;

            return getTimestampIdentifier(end) < getTimestampIdentifier(start) ? start : end;
        },
        days() {
            return createDayList(this.parsedStart, this.parsedEnd, this.times.today, this.weekdaySkips);
        },
        dayFormatter() {
            if (this.dayFormat) {
                return this.dayFormat;
            }

            const options = { timeZone: "UTC", day: "numeric" };

            return createNativeLocaleFormatter(this.currentLocale, (_tms, _short) => options);
        },
        weekdayFormatter() {
            if (this.weekdayFormat) {
                return this.weekdayFormat;
            }

            const longOptions = { timeZone: "UTC", weekday: "long" };
            const shortOptions = { timeZone: "UTC", weekday: "short" };

            return createNativeLocaleFormatter(this.currentLocale, (_tms, short) => (short ? shortOptions : longOptions));
        },
    },
    methods: {
        getRelativeClasses(timestamp, outside = false) {
            return {
                "v-present": timestamp.present,
                "v-past": timestamp.past,
                "v-future": timestamp.future,
                "v-outside": outside,
            };
        },
        getStartOfWeek(timestamp) {
            return getStartOfWeek(timestamp, this.parsedWeekdays, this.times.today);
        },
        getEndOfWeek(timestamp) {
            return getEndOfWeek(timestamp, this.parsedWeekdays, this.times.today);
        },
        getFormatter(options) {
            return createNativeLocaleFormatter(this.locale, (_tms, _short) => options);
        },
    },
});
