import Vue from "vue";

// Mixins
import Table from "../../mixins/table";
// Utils
import { convertToUnit, getObjectValueByPath, getPrefixedScopedSlots, getPropertyFromItem, getSlot } from "../../utils/helpers";
import { mergeClasses } from "../../utils/merge-data";
import OSimpleCheckbox from "../OCheckbox/OSimpleCheckbox";
import OProgressBar from "../OProgress/OProgressBar";
import OSheet from "../OSheet/OSheet";
import OSimpleTable from "./OSimpleTable";
import OTableFooter from "./OTableFooter";
// Components
import OTableHeader from "./OTableHeader";
import OTableRow from "./OTableRow";

export default Vue.extend({
    mixins: [Table],
    provide() {
        return {
            table: this,
        };
    },
    props: {
        ...OSheet.options.props,
        showSearch: { type: Boolean, default: false },
        title: { type: String },
        delete: { type: String },
        create: { type: [String, Function] },
        hideCreate: { type: Boolean, default: false },
        hideDelete: { type: Boolean, default: false },
        sortable: { type: Boolean, default: false },
        headers: { type: Array, default: () => [] },
        readonly: { type: Boolean, default: false },
        dateColumn: { type: String },
        showExport: { type: Boolean, default: false },
        mimeType: { type: String, default: "text/csv" },
        extension: { type: String, default: "csv" },
        encoding: { type: String, default: "utf-8" },
        exportProcess: {
            type: Function,
            default(items) {
                let result = this.headers.map((x) => x.text).join(",") + "\n";
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const row = new Array(Object.keys(item));
                    for (let j = 0; j < this.headers.length; j++) {
                        const header = this.headers[j];
                        const column = this.$get(item, header.value, "");
                        row[j] = column;
                    }
                    result += row.join(",") + "\n";
                }
                return result.trim();
            },
        },
        hideDefaultFooter: Boolean,
        loaderColor: { type: String, default: "primary" },
        loaderHeight: { type: Number, default: 4 },
    },
    computed: {
        createUrl() {
            if (process.browser) {
                const toUrl = new URL(window.location.origin + this.create);
                return toUrl.pathname + toUrl.search;
            }
        },
        deleteUrl() {
            const deleteUrl = this.delete || this.url;
            const qmark = deleteUrl.indexOf("?");
            return qmark >= 0 ? deleteUrl.substr(0, qmark) : deleteUrl;
        },
        categories() {
            return this.headers
                .filter((x) => "category" in x)
                .map((x) => {
                    x = this.$_.cloneDeep(x);
                    if ("categoryText" in x) x.text = x.categoryText;
                    return x;
                });
        },
        isDeleteActionAccepted() {
            if (!this.readonly) {
                return !this.hideDelete;
            }
            return false;
        },
        isCreateActionAccepted() {
            if (!this.readonly && (!!this.create || this.$listeners.create)) {
                return !this.hideCreate;
            }
            return false;
        },
        colspanAttrs() {
            return {
                colspan: this.computedHeaders.length,
            };
        },
    },
    watch: {
        "props.params.page"() {
            this.$refs.table.$el.scrollIntoView();
        },
    },
    methods: {
        goToCreate() {
            if (this.create) {
                this.$router.push(this.createUrl);
            } else {
                this.$emit("create");
            }
        },
        isSelected(item) {
            return !!this.selection[getObjectValueByPath(item, this.itemKey)] || false;
        },
        createItemProps(item, index) {
            return {
                item,
                index,
                select: (v) => this.select(item, v),
                isSelected: this.isSelected(item),
            };
        },
        genCaption(props) {
            if (this.caption) return [this.$createElement("caption", [this.caption])];

            return getSlot(this, "caption", props, true);
        },
        genColgroup() {
            return this.$createElement(
                "colgroup",
                this.computedHeaders.map((header) => {
                    return this.$createElement("col", {
                        style: {
                            width: convertToUnit(header.width),
                            minWidth: convertToUnit(header.width),
                        },
                    });
                }),
            );
        },
        genLoading() {
            const th = this.$createElement(
                "th",
                {
                    staticClass: "column",
                    attrs: this.colspanAttrs,
                },
                [
                    this.$createElement(OProgressBar, {
                        props: {
                            absolute: true,
                            color: this.loaderColor,
                            height: convertToUnit(this.loaderHeight),
                            indeterminate: true,
                        },
                    }),
                ],
            );

            const tr = this.$createElement(
                "tr",
                {
                    staticClass: "o-table__progress",
                },
                [th],
            );
            return this.$createElement("thead", [tr]);
        },
        genHeaders() {
            const children = [getSlot(this, "header")];

            const scopedSlots = getPrefixedScopedSlots("header.", this.$scopedSlots);
            children.push(
                this.$createElement(OTableHeader, {
                    props: {
                        headers: this.computedHeaders,
                        params: this.props.params,
                        everyItem: this.everyItem,
                        someItems: this.someItems,
                        sortable: this.sortable,
                    },
                    on: {
                        "toggle-select-all": this.toggleSelectAll,
                    },
                    scopedSlots,
                }),
            );

            if (this.props.loading) {
                children.push(this.genLoading());
            }

            return children;
        },
        genEmptyWrapper(content) {
            return this.$createElement(
                "tr",
                {
                    staticClass: "o-table__empty-wrapper",
                },
                [
                    this.$createElement(
                        "td",
                        {
                            attrs: this.colspanAttrs,
                        },
                        content,
                    ),
                ],
            );
        },
        genEmpty(originalItemsLength, filteredItemsLength) {
            if (originalItemsLength === 0 && this.props.loading) {
                const loading = this.$slots.loading || this.$t(this.loadingText);
                return this.genEmptyWrapper(loading);
            } else if (originalItemsLength === 0) {
                const noData = this.$slots["no-data"] || this.$t(this.noDataText);
                return this.genEmptyWrapper(noData);
            } else if (filteredItemsLength === 0) {
                const noResults = this.$slots["no-results"] || this.$t(this.noResultsText);
                return this.genEmptyWrapper(noResults);
            }

            return null;
        },
        genItems(items, props) {
            const empty = this.genEmpty(props.count, props.limit);
            if (empty) {
                return [empty];
            }

            return this.genRows(items);
        },
        genRows(items) {
            return this.$scopedSlots.item ? this.genScopedRows(items) : this.genDefaultRows(items);
        },
        genScopedRows(items) {
            const rows = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                rows.push(
                    this.$scopedSlots.item({
                        ...this.createItemProps(item, i),
                    }),
                );
            }

            return rows;
        },
        genDefaultRows(items) {
            return items.map((item, index) => this.genDefaultSimpleRow(item, index));
        },
        genDefaultSimpleRow(item, index, classes = {}) {
            const scopedSlots = getPrefixedScopedSlots("item.", this.$scopedSlots);

            const data = this.createItemProps(item, index);

            if (this.selectable) {
                const slot = scopedSlots["data-table-select"];
                scopedSlots["data-table-select"] = slot
                    ? () =>
                          slot({
                              ...data,
                          })
                    : () =>
                          this.$createElement(OSimpleCheckbox, {
                              staticClass: "o-table__checkbox",
                              props: {
                                  value: data.isSelected,
                                  disabled: !this.isSelectable(item),
                              },
                              on: {
                                  input: (val) => data.select(val),
                              },
                          });
            }

            return this.$createElement(OTableRow, {
                key: getObjectValueByPath(item, this.itemKey),
                class: mergeClasses(
                    {
                        ...classes,
                        "o-table__selected": data.isSelected,
                    },
                    getPropertyFromItem(item, this.itemClass),
                ),
                props: {
                    headers: this.computedHeaders,
                    hideDefaultHeader: this.hideDefaultHeader,
                    index,
                    item,
                    rtl: this.$vanilla.rtl,
                },
                scopedSlots,
                on: {
                    // TODO: for click, the first argument should be the event, and the second argument should be data,
                    // but this is a breaking change so it's for v3
                    click: () => this.$emit("click:row", item, data),
                    contextmenu: (event) => this.$emit("contextmenu:row", event, data),
                    dblclick: (event) => this.$emit("dblclick:row", event, data),
                },
            });
        },
        genBody(props) {
            const data = {
                ...props,
                headers: this.computedHeaders,
                isSelected: this.isSelected,
                select: this.select,
            };

            if (this.$scopedSlots.body) {
                return this.$scopedSlots.body(data);
            }

            return this.$createElement("tbody", [
                getSlot(this, "body.prepend", data, true),
                this.genItems(props.items, props),
                getSlot(this, "body.append", data, true),
            ]);
        },
        genFooters() {
            const data = {
                props: {
                    table: this.table,
                    params: this.props.params,
                    pageLength: this.pageLength,
                    itemsPerPageText: "$vanilla.table.items-per-page",
                },
                on: {
                    "update:params": (params) => this.setParams(params),
                },
            };

            const children = [getSlot(this, "footer", data, true)];

            if (!this.hideDefaultFooter) {
                children.push(
                    this.$createElement(OTableFooter, {
                        ...data,
                        scopedSlots: getPrefixedScopedSlots("footer.", this.$scopedSlots),
                    }),
                );
            }

            return children;
        },
        proxySlot(slot, content) {
            return this.$createElement("template", { slot }, content);
        },
    },
    render() {
        const props = this.scopedProps;
        const simpleProps = {
            height: this.height,
            fixedHeader: this.fixedHeader,
            dense: this.dense,
        };

        return this.$createElement(
            OSheet,
            {
                ref: "table",
                props: {
                    outlined: this.outlined,
                    shaped: this.shaped,
                },
            },
            [
                this.$createElement(
                    OSimpleTable,
                    {
                        props: simpleProps,
                    },
                    [this.genColgroup(), this.genHeaders(), this.genBody(props), this.proxySlot("bottom", this.genFooters())],
                ),
            ],
        );
    },
});
