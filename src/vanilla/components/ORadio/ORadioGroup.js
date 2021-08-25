import Vue from "vue";

// Styles
import "../../styles/elements/_selection-controls.scss";
import "./ORadioGroup.scss";

// Extensions
import OInput from "../OInput/OInput";
import { BaseItemGroup } from "../OItemGroup/OItemGroup";

// Mixins
import Comparable from "../../mixins/comparable";

/* @vue/component */
export default Vue.extend({
    name: "o-radio-group",
    mixins: [Comparable, BaseItemGroup, OInput],
    provide() {
        return {
            radioGroup: this,
        };
    },
    props: {
        column: {
            type: Boolean,
            default: true,
        },
        height: {
            type: [Number, String],
            default: "auto",
        },
        name: String,
        row: Boolean,
        // If no value set on VRadio
        // will match valueComparator
        // force default to null
        value: null,
    },
    computed: {
        classes() {
            return {
                ...OInput.options.computed.classes.call(this),
                "o-input--selection-controls o-input--radio-group": true,
                "o-input--radio-group--column": this.column && !this.row,
                "o-input--radio-group--row": this.row,
            };
        },
    },
    methods: {
        genDefaultSlot() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-input--radio-group__input",
                    attrs: {
                        id: this.id,
                        role: "radiogroup",
                        "aria-labelledby": this.computedId,
                    },
                },
                OInput.options.methods.genDefaultSlot.call(this),
            );
        },
        genInputSlot() {
            const render = OInput.options.methods.genInputSlot.call(this);

            delete render.data.on.click;

            return render;
        },
        genLabel() {
            const label = OInput.options.methods.genLabel.call(this);

            if (!label) {
                return null;
            }

            label.data.attrs.id = this.computedId;
            // WAI considers this an orphaned label
            delete label.data.attrs.for;
            label.tag = "legend";

            return label;
        },
        onClick: BaseItemGroup.options.methods.onClick,
    },
});
