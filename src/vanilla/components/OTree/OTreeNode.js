import Vue from "vue";

// Components
import { OExpandTransition } from "../transitions";
import OIcon from "../OIcon/OIcon";
import OTree from "./OTree";

// Mixins
import { inject as RegistrableInject } from "../../mixins/registrable";
import Colorable from "../../mixins/colorable";

// Utils
import { getObjectValueByPath, createRange } from "../../utils/helpers";

export const OTreeNodeProps = {
    activatable: Boolean,
    activeClass: {
        type: String,
        default: "o-tree-node--active",
    },
    color: {
        type: String,
        default: "primary",
    },
    expandIcon: {
        type: String,
        default: "mdi-menu-down",
    },
    indeterminateIcon: {
        type: String,
        default: "mdi-minus-box",
    },
    itemChildren: {
        type: String,
        default: "children",
    },
    itemDisabled: {
        type: String,
        default: "disabled",
    },
    itemKey: {
        type: String,
        default: "id",
    },
    itemText: {
        type: String,
        default: "name",
    },
    loadChildren: Function,
    loadingIcon: {
        type: String,
        default: "mdi-cached",
    },
    offIcon: {
        type: String,
        default: "mdi-checkbox-blank-outline",
    },
    onIcon: {
        type: String,
        default: "mdi-checkbox-marked",
    },
    openOnClick: Boolean,
    rounded: Boolean,
    selectable: Boolean,
    selectedColor: {
        type: String,
        default: "accent",
    },
    shaped: Boolean,
    transition: Boolean,
    selectionType: {
        type: String,
        default: "leaf",
        validator: (v) => ["leaf", "independent"].includes(v),
    },
};

/* @vue/component */
const OTreeNode = Vue.extend({
    name: "OTree",
    mixins: [Colorable, RegistrableInject("tree")],
    inject: {
        tree: {
            default: null,
        },
    },
    props: {
        level: Number,
        item: {
            type: Object,
            default: () => null,
        },
        parentIsDisabled: Boolean,
        ...OTreeNodeProps,
    },
    data: () => ({
        hasLoaded: false,
        isActive: false, // Node is selected (row)
        isIndeterminate: false, // Node has at least one selected child
        isLoading: false,
        isOpen: false, // Node is open/expanded
        isSelected: false, // Node is selected (checkbox)
    }),
    computed: {
        disabled() {
            return getObjectValueByPath(this.item, this.itemDisabled) || (this.parentIsDisabled && this.selectionType === "leaf");
        },
        key() {
            return getObjectValueByPath(this.item, this.itemKey);
        },
        children() {
            const children = getObjectValueByPath(this.item, this.itemChildren);
            return children && children.filter((child) => !this.tree.isExcluded(getObjectValueByPath(child, this.itemKey)));
        },
        text() {
            return getObjectValueByPath(this.item, this.itemText);
        },
        scopedProps() {
            return {
                item: this.item,
                leaf: !this.children,
                selected: this.isSelected,
                indeterminate: this.isIndeterminate,
                active: this.isActive,
                open: this.isOpen,
            };
        },
        computedIcon() {
            if (this.isIndeterminate) return this.indeterminateIcon;
            else if (this.isSelected) return this.onIcon;
            else return this.offIcon;
        },
        hasChildren() {
            return !!this.children && (!!this.children.length || !!this.loadChildren);
        },
    },
    created() {
        this.tree.register(this);
    },
    beforeDestroy() {
        this.tree.unregister(this);
    },
    methods: {
        checkChildren() {
            return new Promise((resolve) => {
                // TODO: Potential issue with always trying
                // to load children if response is empty?
                if (!this.children || this.children.length || !this.loadChildren || this.hasLoaded) return resolve();

                this.isLoading = true;
                resolve(this.loadChildren(this.item));
            }).then(() => {
                this.isLoading = false;
                this.hasLoaded = true;
            });
        },
        open() {
            this.isOpen = !this.isOpen;
            this.tree.updateOpen(this.key, this.isOpen);
            this.tree.emitOpen();
        },
        genLabel() {
            const children = [];

            if (this.$scopedSlots.label) children.push(this.$scopedSlots.label(this.scopedProps));
            else children.push(this.text);

            return this.$createElement(
                "div",
                {
                    slot: "label",
                    staticClass: "o-tree-node__label",
                },
                children,
            );
        },
        genPrependSlot() {
            if (!this.$scopedSlots.prepend) return null;

            return this.$createElement(
                "div",
                {
                    staticClass: "o-tree-node__prepend",
                },
                this.$scopedSlots.prepend(this.scopedProps),
            );
        },
        genAppendSlot() {
            if (!this.$scopedSlots.append) return null;

            return this.$createElement(
                "div",
                {
                    staticClass: "o-tree-node__append",
                },
                this.$scopedSlots.append(this.scopedProps),
            );
        },
        genContent() {
            const children = [this.genPrependSlot(), this.genLabel(), this.genAppendSlot()];

            return this.$createElement(
                "div",
                {
                    staticClass: "o-tree-node__content",
                },
                children,
            );
        },
        genToggle() {
            return this.$createElement(
                OIcon,
                {
                    staticClass: "o-tree-node__toggle",
                    class: {
                        "o-tree-node__toggle--open": this.isOpen,
                        "o-tree-node__toggle--loading": this.isLoading,
                    },
                    slot: "prepend",
                    on: {
                        click: (e) => {
                            e.stopPropagation();

                            if (this.isLoading) return;

                            this.checkChildren().then(() => this.open());
                        },
                    },
                },
                [this.isLoading ? this.loadingIcon : this.expandIcon],
            );
        },
        genCheckbox() {
            return this.$createElement(
                OIcon,
                {
                    staticClass: "o-tree-node__checkbox",
                    props: {
                        color: this.isSelected || this.isIndeterminate ? this.selectedColor : undefined,
                        disabled: this.disabled,
                    },
                    on: {
                        click: (e) => {
                            e.stopPropagation();

                            if (this.isLoading) return;

                            this.checkChildren().then(() => {
                                // We nextTick here so that items watch in OTree has a chance to run first
                                this.$nextTick(() => {
                                    this.isSelected = !this.isSelected;
                                    this.isIndeterminate = false;

                                    this.tree.updateSelected(this.key, this.isSelected);
                                    this.tree.emitSelected();
                                });
                            });
                        },
                    },
                },
                [this.computedIcon],
            );
        },
        genLevel(level) {
            return createRange(level).map(() =>
                this.$createElement("div", {
                    staticClass: "o-tree-node__level",
                }),
            );
        },
        genNode() {
            const children = [this.genContent()];

            if (this.selectable) children.unshift(this.genCheckbox());

            if (this.hasChildren) {
                children.unshift(this.genToggle());
            } else {
                children.unshift(...this.genLevel(1));
            }

            children.unshift(...this.genLevel(this.level));

            return this.$createElement(
                "div",
                this.setTextColor(this.isActive && this.color, {
                    staticClass: "o-tree-node__root",
                    class: {
                        [this.activeClass]: this.isActive,
                    },
                    on: {
                        click: () => {
                            if (this.openOnClick && this.hasChildren) {
                                this.checkChildren().then(this.open);
                            } else if (this.activatable && !this.disabled) {
                                this.isActive = !this.isActive;
                                this.tree.updateActive(this.key, this.isActive);
                                this.tree.emitActive();
                            }
                        },
                    },
                }),
                children,
            );
        },
        genChild(item, parentIsDisabled) {
            return this.$createElement(OTreeNode, {
                key: getObjectValueByPath(item, this.itemKey),
                props: {
                    activatable: this.activatable,
                    activeClass: this.activeClass,
                    item,
                    selectable: this.selectable,
                    selectedColor: this.selectedColor,
                    color: this.color,
                    expandIcon: this.expandIcon,
                    indeterminateIcon: this.indeterminateIcon,
                    offIcon: this.offIcon,
                    onIcon: this.onIcon,
                    loadingIcon: this.loadingIcon,
                    itemKey: this.itemKey,
                    itemText: this.itemText,
                    itemDisabled: this.itemDisabled,
                    itemChildren: this.itemChildren,
                    loadChildren: this.loadChildren,
                    transition: this.transition,
                    openOnClick: this.openOnClick,
                    rounded: this.rounded,
                    shaped: this.shaped,
                    level: this.level + 1,
                    selectionType: this.selectionType,
                    parentIsDisabled,
                },
                scopedSlots: this.$scopedSlots,
            });
        },
        genChildrenWrapper() {
            if (!this.isOpen || !this.children) return null;

            const children = [this.children.map((c) => this.genChild(c, this.disabled))];

            return this.$createElement(
                "div",
                {
                    staticClass: "o-tree-node__children",
                },
                children,
            );
        },
        genTransition() {
            return this.$createElement(OExpandTransition, [this.genChildrenWrapper()]);
        },
    },
    render(h) {
        const children = [this.genNode()];

        if (this.transition) {
            children.push(this.genTransition());
        } else {
            children.push(this.genChildrenWrapper());
        }

        return h(
            "div",
            {
                staticClass: "o-tree-node",
                class: {
                    "o-tree-node--leaf": !this.hasChildren,
                    "o-tree-node--click": this.openOnClick,
                    "o-tree-node--disabled": this.disabled,
                    "o-tree-node--rounded": this.rounded,
                    "o-tree-node--shaped": this.shaped,
                    "o-tree-node--selected": this.isSelected,
                },
                attrs: {
                    "aria-expanded": String(this.isOpen),
                },
            },
            children,
        );
    },
});

export default OTreeNode;
