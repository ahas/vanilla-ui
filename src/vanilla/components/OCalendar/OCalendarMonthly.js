// Styles
import "./OCalendarWeekly.scss";

// Mixins
import OCalendarWeekly from "./OCalendarWeekly";

// Util
import { parseTimestamp, getStartOfMonth, getEndOfMonth } from "./utils/timestamp";

/* @vue/component */
export default OCalendarWeekly.extend({
    name: "OCalendarWeekly",

    computed: {
        staticClass() {
            return "o-calendar-monthly o-calendar-weekly";
        },
        parsedStart() {
            return getStartOfMonth(parseTimestamp(this.start, true));
        },
        parsedEnd() {
            return getEndOfMonth(parseTimestamp(this.end, true));
        },
    },
});
