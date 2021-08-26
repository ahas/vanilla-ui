import "./OSimpleCheckbox.scss";
import Vue from "vue";
import ripple from "../../directives/ripple";
import { VIcon } from "../VIcon";

// Mixins
import Colorable from "../../mixins/colorable";
import Themeable from "../../mixins/themeable";

// Utils
import mergeData from "../../utils/merge-data";
import { wrapInArray } from "../../utils/helpers";

export default Vue.extend({
    name: "OSimpleCheckbox",
    functional: true,
    directives: {
        ripple,
    },
    props: {
        ...Colorable.options.props,
        ...Themeable.options.props,
        disabled: Boolean,
        ripple: {
            type: Boolean,
            default: true,
        },
        value: Boolean,
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: "mdi-minus-box",
        },
        onIcon: {
            type: String,
            default: "mdi-checkbox-marked",
        },
        offIcon: {
            type: String,
            default: "mdi-checkbox-blank-outline",
        },
    },
    render(h, { props, data }) {
        const children = [];
        let icon = props.offIcon;
        if (props.indeterminate) icon = props.indeterminateIcon;
        else if (props.value) icon = props.onIcon;

        children.push(
            h(
                VIcon,
                Colorable.options.methods.setTextColor(props.value && props.color, {
                    props: {
                        disabled: props.disabled,
                        dark: props.dark,
                        light: props.light,
                    },
                }),
                icon,
            ),
        );
        if (props.ripple && !props.disabled) {
            const ripple = h(
                "div",
                Colorable.options.methods.setTextColor(props.color, {
                    staticClass: "v-input--selection-controls__ripple",
                    directives: [
                        {
                            name: "ripple",
                            value: { center: true },
                        },
                    ],
                }),
            );

            children.push(ripple);
        }
        return h(
            "div",
            mergeData(data, {
                class: {
                    "v-simple-checkbox": true,
                    "v-simple-checkbox--disabled": props.disabled,
                },
                on: {
                    click: (e: Event) => {
                        e.stopPropagation();

                        if (data.on && data.on.input && !props.disabled) {
                            wrapInArray(data.on.input).forEach((f) => f(!props.value));
                        }
                    },
                },
            }),
            [h("div", { staticClass: "v-input--selection-controls__input" }, children)],
        );
    },
});
