// Styles
import "../../styles/elements/_selection-controls.scss";
import "./OSwitch.scss";

// Mixins
import Selectable from "../../mixins/selectable";
import OInput from "../OInput/OInput";

// Directives
import Touch from "../../directives/touch";

// Components
import { OFabTransition } from "../transitions";
import OProgress from "../OProgress/OProgress";

// Helpers
import { KeyCodes } from "../../utils/helpers";

/* @vue/component */
export default Selectable.extend({
    name: "OSwitch",
    directives: { Touch },
    props: {
        loading: {
            type: [Boolean, String],
            default: false,
        },
    },
    computed: {
        classes() {
            return {
                ...OInput.options.computed.classes.call(this),
                "o-input--selection-controls o-input--switch": true,
            };
        },
        attrs() {
            return {
                "aria-checked": String(this.isActive),
                "aria-disabled": String(this.isDisabled),
                role: "switch",
            };
        },
        // Do not return undefined if disabled,
        // according to spec, should still show
        // a color when disabled and active
        validationState() {
            if (this.hasError && this.shouldValidate) return "error";
            if (this.hasSuccess) return "success";
            if (this.hasColor !== null) return this.computedColor;
            return undefined;
        },
    },
    methods: {
        genDefaultSlot() {
            return [this.genSwitch(), this.genLabel()];
        },
        genSwitch() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-input--selection-controls__input",
                },
                [
                    this.genInput("checkbox", {
                        ...this.attrs,
                        ...this.attrs$,
                    }),
                    this.$createElement("div", {
                        staticClass: "o-input--switch__track",
                        ...this.setTextColor(this.loading ? undefined : this.validationState, {
                            class: this.themeClasses,
                        }),
                    }),
                    this.$createElement(
                        "div",
                        {
                            staticClass: "o-input--switch__thumb",
                            class: this.themeClasses,
                        },
                        [this.genProgress()],
                    ),
                ],
            );
        },
        genProgress() {
            return this.$createElement(OFabTransition, {}, [
                this.loading === false
                    ? null
                    : this.$slots.progress ||
                      this.$createElement(OProgress, {
                          props: {
                              color: this.loading === true || this.loading === "" ? this.color || "success" : this.loading,
                              size: 16,
                              width: 2,
                              indeterminate: true,
                          },
                      }),
            ]);
        },
        onSwipeLeft() {
            if (this.isActive) this.onChange();
        },
        onSwipeRight() {
            if (!this.isActive) this.onChange();
        },
        onKeydown(e) {
            if ((e.keyCode === KeyCodes.left && this.isActive) || (e.keyCode === KeyCodes.right && !this.isActive)) this.onChange();
        },
    },
});
