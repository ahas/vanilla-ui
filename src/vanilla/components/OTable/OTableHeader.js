import "./OTableHeader.scss";

import Vue from "vue";

// Directives
import ripple from "../../directives/ripple";
// Helpers
import { wrapInArray } from "../../utils/helpers";
import OSimpleCheckbox from "../OCheckbox/OSimpleCheckbox";
// Components
import OIcon from "../OIcon/OIcon";

export default Vue.extend({
    name: "OTableHeader",
    directives: {
        ripple,
    },
    props: {
        headers: {
            type: Array,
            default: () => [],
        },
        params: Object,
        everyItem: Boolean,
        someItems: Boolean,
        sortIcon: {
            type: String,
            default: "mdi-arrow-up",
        },
        sortable: Boolean,
    },
    methods: {
        genSelectAll() {
            const data = {
                props: {
                    value: this.everyItem,
                    indeterminate: !this.everyItem && this.someItems,
                },
                on: {
                    input: (v) => this.$emit("toggle-select-all", v),
                },
            };

            if (this.$scopedSlots["table-select"]) {
                return this.$scopedSlots["table-select"](data);
            }

            return this.$createElement(OSimpleCheckbox, {
                staticClass: "o-table__checkbox",
                ...data,
            });
        },
        genSortIcon() {
            return this.$createElement(
                OIcon,
                {
                    staticClass: "o-table-header__icon",
                    props: {
                        size: 18,
                    },
                },
                [this.sortIcon],
            );
        },
        getAria(beingSorted, isDesc) {
            const $t = (key) => this.$t(`$vanilla.table.aria-label.${key}`);

            let ariaSort = "none";
            let ariaLabel = [$t("sortNone"), $t("activateAscending")];

            if (!beingSorted) {
                return { ariaSort, ariaLabel: ariaLabel.join(" ") };
            }

            if (isDesc) {
                ariaSort = "descending";
                ariaLabel = [$t("sortDescending"), $t("activateNone")];
            } else {
                ariaSort = "ascending";
                ariaLabel = [$t("sortAscending"), $t("activateDescending")];
            }

            return { ariaSort, ariaLabel: ariaLabel.join(" ") };
        },
        genHeader(header) {
            const data = {
                attrs: {
                    role: "columnheader",
                    scope: "col",
                    "aria-label": header.text || "",
                },
                class: [`text-${header.align || "start"}`, ...wrapInArray(header.class)],
                on: {},
            };
            const children = [];

            if (header.value === "data-table-select") {
                return this.$createElement("th", data, [this.genSelectAll()]);
            }

            children.push(this.$scopedSlots[header.value] ? this.$scopedSlots[header.value]({ header }) : this.$createElement("span", [header.text]));

            if (this.sortable && (header.sortable || !header.hasOwnProperty("sortable"))) {
                data.on.click = () => this.$emit("sort", header.value);

                const sortIndex = this.params.order?.findIndex((o) => o?.[0] === header.value) || -1;
                const beingSorted = sortIndex >= 0;
                const isDesc = this.params.order?.[sortIndex]?.[1]?.toUpperCase() === "DESC";

                data.class.push("sortable");

                const { ariaLabel, ariaSort } = this.getAria(beingSorted, isDesc);

                data.attrs["aria-label"] += `${header.text ? ": " : ""}${ariaLabel}`;
                data.attrs["aria-sort"] = ariaSort;

                if (beingSorted) {
                    data.class.push("active");
                    data.class.push(isDesc ? "desc" : "asc");
                }

                if (header.align === "end") {
                    children.unshift(this.genSortIcon());
                } else {
                    children.push(this.genSortIcon());
                }
            }

            return this.$createElement("th", data, children);
        },
    },
    render() {
        return this.$createElement(
            "thead",
            {
                staticClass: "o-table-header",
            },
            [
                this.$createElement(
                    "tr",
                    this.headers.map((header) => this.genHeader(header)),
                ),
            ],
        );
    },
});
