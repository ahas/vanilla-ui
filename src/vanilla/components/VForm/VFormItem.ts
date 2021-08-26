import "./VFormItem.scss";

import { VNode, PropType } from "vue";
import { inject as RegistrableInject } from "../../mixins/registrable";
import mixins from "../../utils/mixins";

const BaseMixins = mixins(RegistrableInject<"form", any>("form"));

export default BaseMixins.extend({
    name: "VFormItem",
    props: {
        id: {} as PropType<any>,
        label: String,
        labelCols: {
            type: [String, Number] as PropType<string | number>,
            validate: (col: string | number) => !isNaN(+col),
            default: 3,
        },
        required: Boolean,
        rules: { type: Array },
    },
    computed: {
        labelClasses(): object {
            const classes = {
                "v-form-item__label": true,
                "v-form-item__label--required": this.required,
            } as any;
            const labelCols = this.form?.labelCols || this.labelCols || false;
            if (labelCols) {
                classes["v-col-" + labelCols] = true;
            }
            return classes;
        },
    },
    render(h): VNode {
        return h("div", { staticClass: "v-form-item" }, [
            this.$createElement("label", { class: this.labelClasses }, this.label),
            this.$createElement("div", { staticClass: "v-form-item__input" }, this.$slots.default),
        ]);
    },
});
