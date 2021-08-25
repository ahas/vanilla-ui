import "./OLayout.scss";
import Vue from "vue";
import { upperFirst } from "../../utils/helpers";

import Containable from "../../mixins/containable";

// no xs
const breakpoints = ["sm", "md", "lg", "xl"];
const ALIGNMENT = ["start", "end", "center"];

function makeProps(prefix, def) {
    return breakpoints.reduce((props, val) => {
        props[prefix + upperFirst(val)] = def();
        return props;
    }, {});
}

const alignValidator = (str) => [...ALIGNMENT, "baseline", "stretch"].includes(str);
const alignProps = makeProps("align", () => ({
    type: String,
    default: null,
    validator: alignValidator,
}));

const justifyValidator = (str) => [...ALIGNMENT, "space-between", "space-around"].includes(str);
const justifyProps = makeProps("justify", () => ({
    type: String,
    default: null,
    validator: justifyValidator,
}));

const alignContentValidator = (str) => [...ALIGNMENT, "space-between", "space-around", "stretch"].includes(str);
const alignContentProps = makeProps("alignContent", () => ({
    type: String,
    default: null,
    validator: alignContentValidator,
}));

const propMap = {
    align: Object.keys(alignProps),
    justify: Object.keys(justifyProps),
    alignContent: Object.keys(alignContentProps),
};

const classMap = {
    align: "align",
    justify: "justify",
    alignContent: "align-content",
};

function breakpointClass(type, prop, val) {
    let className = classMap[type];
    if (val == null) {
        return undefined;
    }
    if (prop) {
        // alignSm -> Sm
        const breakpoint = prop.replace(type, "");
        className += `-${breakpoint}`;
    }
    // .align-items-sm-center
    className += `-${val}`;
    return className.toLowerCase();
}

const cache = new Map();

export default Vue.extend({
    name: "OLayout",
    mixins: [Containable],
    props: {
        tag: {
            type: String,
            default: "div",
        },
        reverse: Boolean,
        dense: Boolean,
        orientation: {
            type: String,
            validator: (v) => v == "vertical" || v == "horizontal",
            default: "horizontal",
        },
        align: {
            type: String,
            default: null,
            validator: alignValidator,
        },
        ...alignProps,
        justify: {
            type: String,
            default: null,
            validator: justifyValidator,
        },
        ...justifyProps,
        alignContent: {
            type: String,
            default: null,
            validator: alignContentValidator,
        },
        ...alignContentProps,
        space: {
            type: [String, Number],
            default: 0,
        },
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
            // Loop through `align`, `justify`, `alignContent` breakpoint props
            let type;
            for (type in propMap) {
                propMap[type].forEach((prop) => {
                    const value = this[prop];
                    const className = breakpointClass(type, prop, value);
                    if (className) {
                        classList.push(className);
                    }
                });
            }

            classList.push({
                "flex-row": this.orientation == "horizontal",
                "flex-column": this.orientation == "vertical",
                "flex-reverse": this.reverse,
                [`align-${this.align}`]: this.align,
                [`justify-${this.justify}`]: this.justify,
                [`align-content-${this.alignContent}`]: this.alignContent,
                [`space-${this.space}`]: !!this.space ? this.space : null,
            });

            cache.set(cacheKey, classList);
        }

        return h(
            this.tag,
            {
                staticClass: "layout",
                class: [classList, this.containableClasses],
                style: { ...this.containableStyles },
            },
            this.$slots.default,
        );
    },
});
