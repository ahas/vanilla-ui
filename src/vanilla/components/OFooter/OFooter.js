import Vue from "vue";

// Styles
import "./OFooter.scss";

// Components
import OSheet from "../OSheet/OSheet";

// Mixins
import Applicationable from "../../mixins/applicationable";
import SSRBootable from "../../mixins/ssr-bootable";

// Utils
import { convertToUnit } from "../../utils/helpers";

/* @vue/component */
export default Vue.extend({
    name: "OFooter",
    mixins: [OSheet, Applicationable("footer", ["height", "inset"]), SSRBootable],
    props: {
        height: {
            default: "auto",
            type: [Number, String],
        },
        inset: Boolean,
        padless: Boolean,
        tag: {
            type: String,
            default: "footer",
        },
    },
    computed: {
        applicationProperty() {
            return this.inset ? "insetFooter" : "footer";
        },
        classes() {
            return {
                ...OSheet.options.computed.classes.call(this),
                "o-footer--absolute": this.absolute,
                "o-footer--fixed": !this.absolute && (this.app || this.fixed),
                "o-footer--padless": this.padless,
                "o-footer--inset": this.inset,
            };
        },
        computedBottom() {
            if (!this.isPositioned) return undefined;

            return this.app ? this.$vanilla.application.bottom : 0;
        },
        computedLeft() {
            if (!this.isPositioned) return undefined;

            return this.app && this.inset ? this.$vanilla.application.left : 0;
        },
        computedRight() {
            if (!this.isPositioned) return undefined;

            return this.app && this.inset ? this.$vanilla.application.right : 0;
        },
        isPositioned() {
            return Boolean(this.absolute || this.fixed || this.app);
        },
        styles() {
            const height = parseInt(this.height);

            return {
                ...OSheet.options.computed.styles.call(this),
                height: isNaN(height) ? height : convertToUnit(height),
                left: convertToUnit(this.computedLeft),
                right: convertToUnit(this.computedRight),
                bottom: convertToUnit(this.computedBottom),
            };
        },
    },
    methods: {
        updateApplication() {
            const height = parseInt(this.height);

            return isNaN(height) ? (this.$el ? this.$el.clientHeight : 0) : height;
        },
    },
    render(h) {
        const data = this.setBackgroundColor(this.color, {
            staticClass: "o-footer",
            class: this.classes,
            style: this.styles,
        });

        return h(this.tag, data, this.$slots.default);
    },
});
