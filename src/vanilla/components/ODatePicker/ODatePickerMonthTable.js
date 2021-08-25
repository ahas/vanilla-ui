import Vue from "vue";

// Mixins
import DatePickerTable from "./mixins/date-picker-table";

// Utils
import { pad, createNativeLocaleFormatter } from "./utils";

export default Vue.extend({
    name: "ODatePickerMonthTable",
    mixins: [DatePickerTable],
    computed: {
        formatter() {
            return this.format || createNativeLocaleFormatter(this.currentLocale, { month: "short", timeZone: "UTC" }, { start: 5, length: 2 });
        },
    },
    methods: {
        calculateTableDate(delta) {
            return `${parseInt(this.tableDate, 10) + Math.sign(delta || 1)}`;
        },
        genTBody() {
            const children = [];
            const cols = Array(3).fill(null);
            const rows = 12 / cols.length;

            for (let row = 0; row < rows; row++) {
                const tds = cols.map((_, col) => {
                    const month = row * cols.length + col;
                    const date = `${this.displayedYear}-${pad(month + 1)}`;
                    return this.$createElement(
                        "td",
                        {
                            key: month,
                        },
                        [this.genButton(date, false, "month", this.formatter)],
                    );
                });

                children.push(
                    this.$createElement(
                        "tr",
                        {
                            key: row,
                        },
                        tds,
                    ),
                );
            }

            return this.$createElement("tbody", children);
        },
    },
    render() {
        return this.genTable("o-date-picker-table o-date-picker-table--month", [this.genTBody()], this.calculateTableDate);
    },
});
