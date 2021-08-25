// Styles
import "./OMain.scss";

// Mixins
import SSRBootable from "../../mixins/ssr-bootable";

/* @vue/component */
export default SSRBootable.extend({
    name: "OMain",
    props: {
        tag: {
            type: String,
            default: "main",
        },
    },
    computed: {
        styles() {
            const { bar, top, right, footer, insetFooter, bottom, left } = this.$vanilla.application;

            return {
                paddingTop: `${top + bar}px`,
                paddingRight: `${right}px`,
                paddingBottom: `${footer + insetFooter + bottom}px`,
                paddingLeft: `${left}px`,
            };
        },
    },
    render(h) {
        const data = {
            staticClass: "o-main",
            style: this.styles,
            ref: "main",
        };

        return h(this.tag, data, [h("div", { staticClass: "o-main__wrap" }, this.$slots.default)]);
    },
});
