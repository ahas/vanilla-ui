import "./VContainer.scss";
import { VNode, VNodeData } from "vue";
import mergeData from "../../utils/merge-data";
import mixins from "../../utils/mixins";
import Containable from "../../mixins/containable";

/* @vue/component */
export default mixins(Containable).extend({
    name: "v-container",
    mixins: [Containable],
    props: {
        id: String,
        tag: {
            type: String,
            default: "div",
        },
        fluid: {
            type: Boolean,
            default: false,
        },
    },
    render(h): VNode {
        let classes: string[] = [];
        const data: VNodeData = {};

        if (this.$attrs) {
            // reset attrs to extract utility clases like pa-3
            data.attrs = {};
            classes = Object.keys(this.$attrs).filter((key) => {
                // TODO: Remove once resolved
                // https://github.com/vuejs/vue/issues/7841
                if (key === "slot") return false;

                const value = this.$attrs[key];

                // add back data attributes like data-test="foo" but do not
                // add them as classes
                if (key.startsWith("data-")) {
                    data.attrs![key] = value;
                    return false;
                }

                return value || typeof value === "string";
            });
        }

        if (this.id) {
            data.domProps = data.domProps || {};
            data.domProps.id = this.id;
        }
        return h(
            this.tag,
            mergeData(data, {
                staticClass: "v-container",
                class: [
                    ...classes,
                    ...this.containableClasses,
                    {
                        "v-container--fluid": this.fluid,
                    },
                ],
                style: { ...this.containableStyles },
            }),
            this.$slots.default,
        );
    },
});
