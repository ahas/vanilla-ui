import "./OFormItem.scss";
import Vue from "vue";

export default Vue.extend({
    name: "OFormItem",
    inject: ["oform"],
    props: {
        id: {},
        label: String,
        labelCols: {
            type: [String, Number],
            validate: (col) => !isNaN(+col),
            default: 3,
        },
        required: Boolean,
        rules: { type: Array },
    },
    computed: {
        labelClasses() {
            const classes = {
                "o-form-item__label": true,
                "o-form-item__label--required": this.required,
            };
            const labelCols = this.oform?.labelCols || this.labelCols || false;
            if (labelCols) {
                classes["o-col-" + labelCols] = true;
            }
            return classes;
        },
    },
    render(h) {
        return h("div", { staticClass: "o-form-item" }, [
            this.$createElement("label", { class: this.labelClasses }, this.label),
            this.$createElement("div", { staticClass: "o-form-item__input" }, this.$slots.default),
        ]);
    },
});
