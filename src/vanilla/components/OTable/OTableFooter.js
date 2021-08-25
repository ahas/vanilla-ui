import "./OTableFooter.scss";

import Vue from "vue";

import OPagination from "../OPagination/OPagination";
// Components
import OSelect from "../OSelect/OSelect";

export default Vue.extend({
    name: "OTableFooter",
    props: {
        table: {
            type: Object,
            required: true,
        },
        params: {
            type: Object,
            required: true,
        },
        pageLength: Number,
        itemsPerPageOptions: {
            type: Array,
            default: () => [5, 10, 15, 20, 30, 50, 100, 250, 500],
        },
        itemsPerPageText: {
            type: String,
            default: "$vanilla.table-footer.items-per-page",
        },
        itemsPerPageAllText: {
            type: String,
            default: "$vanilla.table-footer.items-per-page-all",
        },
        pageText: {
            type: String,
            default: "$vanilla.table-footer.page-text",
        },
    },
    computed: {
        computedDataItemsPerPageOptions() {
            return this.itemsPerPageOptions.map((option) => {
                if (typeof option === "object") {
                    return option;
                } else {
                    return this.genDataItemsPerPageOption(option);
                }
            });
        },
    },
    methods: {
        setParams(params) {
            this.$emit("update:params", Object.assign({}, this.params, params));
        },
        genDataItemsPerPageOption(option) {
            return {
                text: option === -1 ? this.$t(this.itemsPerPageAllText) : String(option),
                value: option,
            };
        },
        genItemsPerPageSelect() {
            let value = this.params.limit;
            const computedIPPO = this.computedDataItemsPerPageOptions;

            if (computedIPPO.length <= 1) {
                return null;
            }

            if (!computedIPPO.find((ippo) => ippo.value === value)) {
                value = computedIPPO[0];
            }

            return this.$createElement(
                "div",
                {
                    staticClass: "o-table-footer__select",
                },
                [
                    this.$t(this.itemsPerPageText),
                    this.$createElement(OSelect, {
                        attrs: {
                            "aria-label": this.$t(this.itemsPerPageText),
                        },
                        props: {
                            disabled: this.disableItemsPerPage,
                            items: computedIPPO,
                            value,
                            hideDetails: true,
                            auto: true,
                            minWidth: "75px",
                        },
                        on: {
                            input: (limit) => this.setParams({ limit }),
                        },
                    }),
                ],
            );
        },
        genPagination() {
            return this.$createElement(
                "div",
                {
                    class: "o-table-footer__pagination",
                },
                [
                    this.$createElement(OPagination, {
                        props: {
                            value: this.params.page,
                            totalVisible: 10,
                            length: this.pageLength,
                        },
                        on: {
                            input: (page) => this.setParams({ page }),
                        },
                    }),
                ],
            );
        },
    },
    render() {
        return this.$createElement(
            "div",
            {
                staticClass: "o-table-footer",
            },
            [this.genPagination(), this.genItemsPerPageSelect()],
        );
    },
});
