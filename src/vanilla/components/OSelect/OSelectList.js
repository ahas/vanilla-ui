import Vue from "vue";

// Components
import OSimpleCheckbox from "../OCheckbox/OSimpleCheckbox";
import ODivider from "../ODivider/ODivider";
import OSubheader from "../OSubheader/OSubheader";
import { OList, OListItem, OListItemAction, OListItemContent, OListItemTitle } from "../OList";

// Directives
import ripple from "../../directives/ripple";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";

// Utils
import { escapeHTML, getPropertyFromItem } from "../../utils/helpers";

/* @vue/component */
export default Vue.extend({
    name: "OSelectList",
    directives: {
        ripple,
    },
    mixins: [Colorable, Themeable],
    props: {
        action: Boolean,
        dense: Boolean,
        hideSelected: Boolean,
        items: {
            type: Array,
            default: () => [],
        },
        itemDisabled: {
            type: [String, Array, Function],
            default: "disabled",
        },
        itemText: {
            type: [String, Array, Function],
            default: "text",
        },
        itemValue: {
            type: [String, Array, Function],
            default: "value",
        },
        noDataText: String,
        noFilter: Boolean,
        searchInput: null,
        selectedItems: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        parsedItems() {
            return this.selectedItems.map((item) => this.getValue(item));
        },
        tileActiveClass() {
            return Object.keys(this.setTextColor(this.color).class || {}).join(" ");
        },
        staticNoDataTile() {
            const tile = {
                attrs: {
                    role: undefined,
                },
                on: {
                    mousedown: (e) => e.preventDefault(), // Prevent onBlur from being called
                },
            };

            return this.$createElement(OListItem, tile, [this.genTileContent(this.noDataText)]);
        },
    },
    methods: {
        genAction(item, inputValue) {
            return this.$createElement(OListItemAction, [
                this.$createElement(OSimpleCheckbox, {
                    props: {
                        color: this.color,
                        value: inputValue,
                    },
                    on: {
                        input: () => this.$emit("select", item),
                    },
                }),
            ]);
        },
        genDivider(props) {
            return this.$createElement(ODivider, { props });
        },
        genFilteredText(text) {
            text = text || "";
            if (!this.searchInput || this.noFilter) return escapeHTML(text);

            const { start, middle, end } = this.getMaskedCharacters(text);

            return `${escapeHTML(start)}${this.genHighlight(middle)}${escapeHTML(end)}`;
        },
        genHeader(props) {
            return this.$createElement(OSubheader, { props }, props.header);
        },
        genHighlight(text) {
            return `<span class="o-list-item__mask">${escapeHTML(text)}</span>`;
        },
        getMaskedCharacters(text) {
            const searchInput = (this.searchInput || "").toString().toLocaleLowerCase();
            const index = text.toLocaleLowerCase().indexOf(searchInput);

            if (index < 0) return { start: text, middle: "", end: "" };

            const start = text.slice(0, index);
            const middle = text.slice(index, index + searchInput.length);
            const end = text.slice(index + searchInput.length);
            return { start, middle, end };
        },
        genTile({ item, index, disabled = null, value = false }) {
            if (!value) value = this.hasItem(item);

            if (item === Object(item)) {
                disabled = disabled !== null ? disabled : this.getDisabled(item);
            }

            const tile = {
                attrs: {
                    // Default behavior in list does not
                    // contain aria-selected by default
                    "aria-selected": String(value),
                    id: `list-item-${this._uid}-${index}`,
                    role: "option",
                },
                on: {
                    mousedown: (e) => {
                        // Prevent onBlur from being called
                        e.preventDefault();
                    },
                    click: () => disabled || this.$emit("select", item),
                },
                props: {
                    activeClass: this.tileActiveClass,
                    disabled,
                    ripple: true,
                    inputValue: value,
                },
            };

            if (!this.$scopedSlots.item) {
                return this.$createElement(OListItem, tile, [
                    this.action && !this.hideSelected && this.items.length > 0 ? this.genAction(item, value) : null,
                    this.genTileContent(item, index),
                ]);
            }

            const parent = this;
            const scopedSlot = this.$scopedSlots.item({
                parent,
                item,
                attrs: {
                    ...tile.attrs,
                    ...tile.props,
                },
                on: tile.on,
            });

            return this.needsTile(scopedSlot) ? this.$createElement(OListItem, tile, scopedSlot) : scopedSlot;
        },
        genTileContent(item, index = 0) {
            const innerHTML = this.genFilteredText(this.getText(item));

            return this.$createElement(OListItemContent, [
                this.$createElement(OListItemTitle, {
                    domProps: { innerHTML },
                }),
            ]);
        },
        hasItem(item) {
            return this.parsedItems.indexOf(this.getValue(item)) > -1;
        },
        needsTile(slot) {
            return slot.length !== 1 || slot[0].componentOptions == null || slot[0].componentOptions.Ctor.options.name !== "o-list-item";
        },
        getDisabled(item) {
            return Boolean(getPropertyFromItem(item, this.itemDisabled, false));
        },
        getText(item) {
            return String(getPropertyFromItem(item, this.itemText, item));
        },
        getValue(item) {
            return getPropertyFromItem(item, this.itemValue, this.getText(item));
        },
    },
    render() {
        const children = [];
        const itemsLength = this.items.length;
        for (let index = 0; index < itemsLength; index++) {
            const item = this.items[index];

            if (this.hideSelected && this.hasItem(item)) continue;

            if (item == null) children.push(this.genTile({ item, index }));
            else if (item.header) children.push(this.genHeader(item));
            else if (item.divider) children.push(this.genDivider(item));
            else children.push(this.genTile({ item, index }));
        }

        children.length || children.push(this.$slots["no-data"] || this.staticNoDataTile);

        this.$slots["prepend-item"] && children.unshift(this.$slots["prepend-item"]);

        this.$slots["append-item"] && children.push(this.$slots["append-item"]);

        return this.$createElement(
            OList,
            {
                staticClass: "o-select-list",
                class: this.themeClasses,
                attrs: {
                    role: "listbox",
                    tabindex: -1,
                },
                props: { dense: this.dense },
            },
            children,
        );
    },
});
