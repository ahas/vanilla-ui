// Styles
import './OAutocomplete.scss';

import {
    getObjectValueByPath,
    getPropertyFromItem,
    KeyCodes,
} from '../../utils/helpers';
// Utilities
import mergeData from '../../utils/merge-data';
// Extensions
import OSelect, {
    defaultMenuProps as OSelectMenuProps,
} from '../OSelect/OSelect';
import OTextField from '../OTextField/OTextField';

const defaultMenuProps = {
    ...OSelectMenuProps,
    offsetY: true,
    offsetOverflow: true,
    transition: false,
};

/* @vue/component */
export default OSelect.extend({
    name: "OAutocomplete",
    props: {
        allowOverflow: {
            type: Boolean,
            default: true,
        },
        autoSelectFirst: {
            type: Boolean,
            default: false,
        },
        filter: {
            type: Function,
            default: (item, queryText, itemText) => {
                return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
            },
        },
        hideNoData: Boolean,
        menuProps: {
            type: OSelect.options.props.menuProps.type,
            default: () => defaultMenuProps,
        },
        noFilter: Boolean,
        searchInput: {
            type: String,
        },
    },
    data() {
        return {
            lazySearch: this.searchInput,
        };
    },
    computed: {
        classes() {
            return {
                ...OSelect.options.computed.classes.call(this),
                "o-autocomplete": true,
                "o-autocomplete--is-selecting-index": this.selectedIndex > -1,
            };
        },
        computedItems() {
            return this.filteredItems;
        },
        selectedValues() {
            return this.selectedItems.map((item) => this.getValue(item));
        },
        hasDisplayedItems() {
            return this.hideSelected ? this.filteredItems.some((item) => !this.hasItem(item)) : this.filteredItems.length > 0;
        },
        currentRange() {
            if (this.selectedItem == null) return 0;

            return String(this.getText(this.selectedItem)).length;
        },
        filteredItems() {
            if (!this.isSearching || this.noFilter || this.internalSearch == null) return this.allItems;

            return this.allItems.filter((item) => {
                const value = getPropertyFromItem(item, this.itemText);
                const text = value != null ? String(value) : "";

                return this.filter(item, String(this.internalSearch), text);
            });
        },
        internalSearch: {
            get() {
                return this.lazySearch;
            },
            set(val) {
                // TODO: this should be `string | null` but it breaks lots of other types
                this.lazySearch = val;

                this.$emit("update:search-input", val);
            },
        },
        isAnyValueAllowed() {
            return false;
        },
        isDirty() {
            return this.searchIsDirty || this.selectedItems.length > 0;
        },
        isSearching() {
            return (this.multiple && this.searchIsDirty) || (this.searchIsDirty && this.internalSearch !== this.getText(this.selectedItem));
        },
        menuCanShow() {
            if (!this.isFocused) return false;

            return this.hasDisplayedItems || !this.hideNoData;
        },
        $_menuProps() {
            const props = OSelect.options.computed.$_menuProps.call(this);
            props.contentClass = `o-autocomplete__content ${props.contentClass || ""}`.trim();
            return {
                ...defaultMenuProps,
                ...props,
            };
        },
        searchIsDirty() {
            return this.internalSearch != null && this.internalSearch !== "";
        },
        selectedItem() {
            if (this.multiple) return null;

            return this.selectedItems.find((i) => {
                return this.valueComparator(this.getValue(i), this.getValue(this.internalValue));
            });
        },
        listData() {
            const data = OSelect.options.computed.listData.call(this);

            data.props = {
                ...data.props,
                items: this.virtualizedItems,
                noFilter: this.noFilter || !this.isSearching || !this.filteredItems.length,
                searchInput: this.internalSearch,
            };

            return data;
        },
    },
    watch: {
        filteredItems: "onFilteredItemsChanged",
        internalValue: "setSearch",
        isFocused(val) {
            if (val) {
                document.addEventListener("copy", this.onCopy);
                this.$refs.input && this.$refs.input.select();
            } else {
                document.removeEventListener("copy", this.onCopy);
                this.$refs.input && this.$refs.input.blur();
                this.updateSelf();
            }
        },
        isMenuActive(val) {
            if (val || !this.hasSlot) return;

            this.lazySearch = null;
        },
        items(val, oldVal) {
            // If we are focused, the menu
            // is not active, hide no data is enabled,
            // and items change
            // User is probably async loading
            // items, try to activate the menu
            if (!(oldVal && oldVal.length) && this.hideNoData && this.isFocused && !this.isMenuActive && val.length) this.activateMenu();
        },
        searchInput(val) {
            this.lazySearch = val;
        },
        internalSearch: "onInternalSearchChanged",
        itemText: "updateSelf",
    },
    created() {
        this.setSearch();
    },
    destroyed() {
        document.removeEventListener("copy", this.onCopy);
    },
    methods: {
        onFilteredItemsChanged(val, oldVal) {
            // TODO: How is the watcher triggered
            // for duplicate items? no idea
            if (val === oldVal) return;

            this.setMenuIndex(-1);

            this.$nextTick(() => {
                if (!this.internalSearch || (val.length !== 1 && !this.autoSelectFirst)) return;

                this.$refs.menu.getTiles();
                this.setMenuIndex(0);
            });
        },
        onInternalSearchChanged() {
            this.updateMenuDimensions();
        },
        updateMenuDimensions() {
            // Type from menuable is not making it through
            this.isMenuActive && this.$refs.menu && this.$refs.menu.updateDimensions();
        },
        changeSelectedIndex(keyCode) {
            // Do not allow changing of selectedIndex
            // when search is dirty
            if (this.searchIsDirty) return;

            if (this.multiple && keyCode === KeyCodes.left) {
                if (this.selectedIndex === -1) {
                    this.selectedIndex = this.selectedItems.length - 1;
                } else {
                    this.selectedIndex--;
                }
            } else if (this.multiple && keyCode === KeyCodes.right) {
                if (this.selectedIndex >= this.selectedItems.length - 1) {
                    this.selectedIndex = -1;
                } else {
                    this.selectedIndex++;
                }
            } else if (keyCode === KeyCodes.backspace || keyCode === KeyCodes.delete) {
                this.deleteCurrentItem();
            }
        },
        deleteCurrentItem() {
            const curIndex = this.selectedIndex;
            const curItem = this.selectedItems[curIndex];

            // Do nothing if input or item is disabled
            if (!this.isInteractive || this.getDisabled(curItem)) return;

            const lastIndex = this.selectedItems.length - 1;

            // Select the last item if
            // there is no selection
            if (this.selectedIndex === -1 && lastIndex !== 0) {
                this.selectedIndex = lastIndex;

                return;
            }

            const length = this.selectedItems.length;
            const nextIndex = curIndex !== length - 1 ? curIndex : curIndex - 1;
            const nextItem = this.selectedItems[nextIndex];

            if (!nextItem) {
                this.setValue(this.multiple ? [] : null);
            } else {
                this.selectItem(curItem);
            }

            this.selectedIndex = nextIndex;
        },
        clearableCallback() {
            this.internalSearch = null;

            OSelect.options.methods.clearableCallback.call(this);
        },
        genInput() {
            const input = OTextField.options.methods.genInput.call(this);

            input.data = mergeData(input.data, {
                attrs: {
                    "aria-activedescendant": getObjectValueByPath(this.$refs.menu, "activeTile.id"),
                    autocomplete: getObjectValueByPath(input.data, "attrs.autocomplete", "off"),
                },
                domProps: { value: this.internalSearch },
            });

            return input;
        },
        genInputSlot() {
            const slot = OSelect.options.methods.genInputSlot.call(this);

            slot.data.attrs.role = "combobox";

            return slot;
        },
        genSelections() {
            return this.hasSlot || this.multiple ? OSelect.options.methods.genSelections.call(this) : [];
        },
        onClick(e) {
            if (!this.isInteractive) return;

            this.selectedIndex > -1 ? (this.selectedIndex = -1) : this.onFocus();

            if (!this.isAppendInner(e.target)) this.activateMenu();
        },
        onInput(e) {
            if (this.selectedIndex > -1 || !e.target) return;

            const target = e.target;
            const value = target.value;

            // If typing and menu is not currently active
            if (target.value) this.activateMenu();

            this.internalSearch = value;
            this.badInput = target.validity && target.validity.badInput;
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;

            if (e.ctrlKey || ![KeyCodes.home, KeyCodes.end].includes(keyCode)) {
                OSelect.options.methods.onKeyDown.call(this, e);
            }

            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onSpaceDown(e) {
            /* noop */
        },
        onTabDown(e) {
            OSelect.options.methods.onTabDown.call(this, e);
            this.updateSelf();
        },
        onUpDown(e) {
            // Prevent screen from scrolling
            e.preventDefault();

            // For autocomplete / combobox, cycling
            // interfers with native up/down behavior
            // instead activate the menu
            this.activateMenu();
        },
        selectItem(item) {
            OSelect.options.methods.selectItem.call(this, item);
            this.setSearch();
        },
        setSelectedItems() {
            OSelect.options.methods.setSelectedItems.call(this);

            // #4273 Don't replace if searching
            // #4403 Don't replace if focused
            if (!this.isFocused) this.setSearch();
        },
        setSearch() {
            // Wait for nextTick so selectedItem
            // has had time to update
            this.$nextTick(() => {
                if (!this.multiple || !this.internalSearch || !this.isMenuActive) {
                    this.internalSearch = !this.selectedItems.length || this.multiple || this.hasSlot ? null : this.getText(this.selectedItem);
                }
            });
        },
        updateSelf() {
            if (!this.searchIsDirty && !this.internalValue) return;

            if (!this.valueComparator(this.internalSearch, this.getValue(this.internalValue))) {
                this.setSearch();
            }
        },
        hasItem(item) {
            return this.selectedValues.indexOf(this.getValue(item)) > -1;
        },
        onCopy(event) {
            if (this.selectedIndex === -1) return;

            const currentItem = this.selectedItems[this.selectedIndex];
            const currentItemText = this.getText(currentItem);
            event.clipboardData?.setData("text/plain", currentItemText);
            event.clipboardData?.setData("text/vnd.olive.autocomplete.item+plain", currentItemText);
            event.preventDefault();
        },
    },
});