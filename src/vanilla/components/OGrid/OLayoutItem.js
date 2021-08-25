import "./OLayoutItem.scss";
import Vue from "vue";
import { upperFirst } from "../../utils/helpers";
import Containable from "../../mixins/containable";

// no xs
const breakpoints = ["sm", "md", "lg", "xl"];

const breakpointProps = (() => {
    return breakpoints.reduce((props, val) => {
        props[val] = {
            type: [Boolean, String, Number],
            default: false,
        };
        return props;
    }, {});
})();

const offsetProps = (() => {
    return breakpoints.reduce((props, val) => {
        props["offset" + upperFirst(val)] = {
            type: [String, Number],
            default: null,
        };
        return props;
    }, {});
})();

const orderProps = (() => {
    return breakpoints.reduce((props, val) => {
        props["order" + upperFirst(val)] = {
            type: [String, Number],
            default: null,
        };
        return props;
    }, {});
})();

const propMap = {
    weight: Object.keys(breakpointProps),
    offset: Object.keys(offsetProps),
    order: Object.keys(orderProps),
};

function breakpointClass(type, prop, val) {
    let className = type;
    if (val == null || val === false) {
        return undefined;
    }
    if (prop) {
        const breakpoint = prop.replace(type, "");
        className += `-${breakpoint}`;
    }
    if (type === "weight" && (val === "" || val === true)) {
        return className.toLowerCase();
    }
    className += `-${val}`;
    return className.toLowerCase();
}

const cache = new Map();

export default Vue.extend({
    name: "OLayoutItem",
    mixins: [Containable],
    props: {
        weight: {
            type: [Boolean, String, Number],
            default: false,
        },
        ...breakpointProps,
        offset: {
            type: [String, Number],
            default: null,
        },
        ...offsetProps,
        order: {
            type: [String, Number],
            default: null,
        },
        ...orderProps,
        alignSelf: {
            type: String,
            default: null,
            validator: (v) => ["auto", "start", "end", "center", "baseline", "stretch"].includes(v),
        },
        align: {
            type: String,
            default: null,
            validator: (v) => ["start", "end", "center"].includes(v),
        },
        justify: {
            type: String,
            default: null,
            validator: (v) => ["start", "end", "center"].includes(v),
        },
        tag: {
            type: String,
            default: "div",
        },
        centered: Boolean,
    },
    render(h) {
        // Super-fast memoization based on props, 5x faster than JSON.stringify
        let cacheKey = "";
        for (const prop in this.$props) {
            cacheKey += String(this[prop]);
        }
        let classList = cache.get(cacheKey);

        if (!classList) {
            classList = [];
            let type;
            for (type in propMap) {
                propMap[type].forEach((prop) => {
                    const value = this[prop];
                    const className = breakpointClass(type, prop, value);
                    if (className) classList.push(className);
                });
            }

            const hasWeightClasses = classList.some((className) => className.startsWith("weight-"));

            classList.push({
                "layout-item": !hasWeightClasses || !this.weight,
                [`layout-item-${this.weight}`]: this.weight,
                [`offset-${this.offset}`]: this.offset,
                [`order-${this.order}`]: this.order,
                [`align-self-${this.alignSelf}`]: this.alignSelf,
                [`layout-item-align-${this.align}`]: this.align,
                [`layout-item-justify-${this.justify}`]: this.justify,
                "text-center": this.centered,
            });

            cache.set(cacheKey, classList);
        }

        return h(
            this.tag,
            {
                class: [classList, this.containableClasses],
                style: this.containableStyles,
            },
            this.$slots.default,
        );
    },
});
