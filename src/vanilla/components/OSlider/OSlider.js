// Styles
import "./OSlider.scss";

import Vue from "vue";

// Directives
import ClickOutside from "../../directives/click-outside";
// Mixins
import Loadable from "../../mixins/loadable";
import { consoleWarn } from "../../utils/console";
// Helpers
import { addOnceEventListener, convertToUnit, createRange, deepEqual, KeyCodes, passiveSupported } from "../../utils/helpers";
// Components
import { OInput } from "../OInput";
import { OScaleTransition } from "../transitions";

export default Vue.extend({
    name: "OSlider",
    mixins: [OInput, Loadable],
    directives: {
        ClickOutside,
    },
    props: {
        disabled: Boolean,
        inverseLabel: Boolean,
        max: {
            type: [Number, String],
            default: 100,
        },
        min: {
            type: [Number, String],
            default: 0,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
        thumbColor: String,
        thumbLabel: {
            type: [Boolean, String],
            default: undefined,
            validator: (v) => typeof v === "boolean" || v === "always",
        },
        thumbSize: {
            type: [Number, String],
            default: 32,
        },
        tickLabels: {
            type: Array,
            default: () => [],
        },
        ticks: {
            type: [Boolean, String],
            default: false,
            validator: (v) => typeof v === "boolean" || v === "always",
        },
        tickSize: {
            type: [Number, String],
            default: 2,
        },
        trackColor: String,
        trackFillColor: String,
        value: [Number, String],
        vertical: Boolean,
    },
    data: () => ({
        app: null,
        oldValue: null,
        thumbPressed: false,
        mouseTimeout: -1,
        isFocused: false,
        isActive: false,
        noClick: false, // Prevent click event if dragging took place, hack for #7915
    }),
    computed: {
        classes() {
            return {
                ...OInput.options.computed.classes.call(this),
                "o-input__slider": true,
                "o-input__slider--vertical": this.vertical,
                "o-input__slider--inverse-label": this.inverseLabel,
            };
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                val = isNaN(val) ? this.minValue : val;
                // Round value to ensure the
                // entire slider range can
                // be selected with step
                const value = this.roundValue(Math.min(Math.max(val, this.minValue), this.maxValue));

                if (value === this.lazyValue) return;

                this.lazyValue = value;

                this.$emit("input", value);
            },
        },
        trackTransition() {
            return this.thumbPressed ? (this.showTicks || this.stepNumeric ? "0.1s cubic-bezier(0.25, 0.8, 0.5, 1)" : "none") : "";
        },
        minValue() {
            return parseFloat(this.min);
        },
        maxValue() {
            return parseFloat(this.max);
        },
        stepNumeric() {
            return this.step > 0 ? parseFloat(this.step) : 0;
        },
        inputWidth() {
            return ((this.roundValue(this.internalValue) - this.minValue) / (this.maxValue - this.minValue)) * 100;
        },
        trackFillStyles() {
            const startDir = this.vertical ? "bottom" : "left";
            const endDir = this.vertical ? "top" : "right";
            const valueDir = this.vertical ? "height" : "width";

            const start = this.$vanilla.rtl ? "auto" : "0";
            const end = this.$vanilla.rtl ? "0" : "auto";
            const value = this.isDisabled ? `calc(${this.inputWidth}% - 10px)` : `${this.inputWidth}%`;

            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
                [valueDir]: value,
            };
        },
        trackStyles() {
            const startDir = this.vertical ? (this.$vanilla.rtl ? "bottom" : "top") : this.$vanilla.rtl ? "left" : "right";
            const endDir = this.vertical ? "height" : "width";

            const start = "0px";
            const end = this.isDisabled ? `calc(${100 - this.inputWidth}% - 10px)` : `calc(${100 - this.inputWidth}%)`;

            return {
                transition: this.trackTransition,
                [startDir]: start,
                [endDir]: end,
            };
        },
        showTicks() {
            return this.tickLabels.length > 0 || !!(!this.isDisabled && this.stepNumeric && this.ticks);
        },
        numTicks() {
            return Math.ceil((this.maxValue - this.minValue) / this.stepNumeric);
        },
        showThumbLabel() {
            return !this.isDisabled && !!(this.thumbLabel || this.$scopedSlots["thumb-label"]);
        },
        computedTrackColor() {
            if (this.isDisabled) return undefined;
            if (this.trackColor) return this.trackColor;
            if (this.isDark) return this.validationState;
            return this.validationState || "grey lighten-1";
        },
        computedTrackFillColor() {
            if (this.isDisabled) return undefined;
            if (this.trackFillColor) return this.trackFillColor;
            return this.validationState || this.computedColor;
        },
        computedThumbColor() {
            if (this.thumbColor) return this.thumbColor;
            return this.validationState || this.computedColor;
        },
    },

    watch: {
        min(val) {
            const parsed = parseFloat(val);
            parsed > this.internalValue && this.$emit("input", parsed);
        },
        max(val) {
            const parsed = parseFloat(val);
            parsed < this.internalValue && this.$emit("input", parsed);
        },
        value: {
            handler(v) {
                this.internalValue = v;
            },
        },
    },
    // If done in as immediate in
    // value watcher, causes issues
    // with vue-test-utils
    beforeMount() {
        this.internalValue = this.value;
    },
    mounted() {
        // Without a o-app, iOS does not work with body selectors
        this.app = document.querySelector("[data-app]") || consoleWarn("Missing o-app or a non-body wrapping element with the [data-app] attribute", this);
    },
    methods: {
        genDefaultSlot() {
            const children = [this.genLabel()];
            const slider = this.genSlider();
            this.inverseLabel ? children.unshift(slider) : children.push(slider);

            children.push(this.genProgress());

            return children;
        },
        genSlider() {
            return this.$createElement(
                "div",
                {
                    class: {
                        "o-slider": true,
                        "o-slider--horizontal": !this.vertical,
                        "o-slider--vertical": this.vertical,
                        "o-slider--focused": this.isFocused,
                        "o-slider--active": this.isActive,
                        "o-slider--disabled": this.isDisabled,
                        "o-slider--readonly": this.isReadonly,
                        ...this.themeClasses,
                    },
                    directives: [
                        {
                            name: "click-outside",
                            value: this.onBlur,
                        },
                    ],
                    on: {
                        click: this.onSliderClick,
                        mousedown: this.onSliderMouseDown,
                    },
                },
                this.genChildren(),
            );
        },
        genChildren() {
            return [
                this.genInput(),
                this.genTrackContainer(),
                this.genSteps(),
                this.genThumbContainer(this.internalValue, this.inputWidth, this.isActive, this.isFocused, this.onFocus, this.onBlur),
            ];
        },
        genInput() {
            return this.$createElement("input", {
                attrs: {
                    value: this.internalValue,
                    id: this.computedId,
                    disabled: true,
                    readonly: true,
                    tabindex: -1,
                    ...this.$attrs,
                },
                // on: this.genListeners(), // TODO: do we need to attach the listeners to input?
            });
        },
        genTrackContainer() {
            const children = [
                this.$createElement(
                    "div",
                    this.setBackgroundColor(this.computedTrackColor, {
                        staticClass: "o-slider__track-background",
                        style: this.trackStyles,
                    }),
                ),
                this.$createElement(
                    "div",
                    this.setBackgroundColor(this.computedTrackFillColor, {
                        staticClass: "o-slider__track-fill",
                        style: this.trackFillStyles,
                    }),
                ),
            ];

            return this.$createElement(
                "div",
                {
                    staticClass: "o-slider__track-container",
                    ref: "track",
                },
                children,
            );
        },
        genSteps() {
            if (!this.step || !this.showTicks) return null;

            const tickSize = parseFloat(this.tickSize);
            const range = createRange(this.numTicks + 1);
            const direction = this.vertical ? "bottom" : this.$vanilla.rtl ? "right" : "left";
            const offsetDirection = this.vertical ? (this.$vanilla.rtl ? "left" : "right") : "top";

            if (this.vertical) range.reverse();

            const ticks = range.map((index) => {
                const children = [];

                if (this.tickLabels[index]) {
                    children.push(
                        this.$createElement(
                            "div",
                            {
                                staticClass: "o-slider__tick-label",
                            },
                            this.tickLabels[index],
                        ),
                    );
                }

                const width = index * (100 / this.numTicks);
                const filled = this.$vanilla.rtl ? 100 - this.inputWidth < width : width < this.inputWidth;

                return this.$createElement(
                    "span",
                    {
                        key: index,
                        staticClass: "o-slider__tick",
                        class: {
                            "o-slider__tick--filled": filled,
                        },
                        style: {
                            width: `${tickSize}px`,
                            height: `${tickSize}px`,
                            [direction]: `calc(${width}% - ${tickSize / 2}px)`,
                            [offsetDirection]: `calc(50% - ${tickSize / 2}px)`,
                        },
                    },
                    children,
                );
            });

            return this.$createElement(
                "div",
                {
                    staticClass: "o-slider__ticks-container",
                    class: {
                        "o-slider__ticks-container--always-show": this.ticks === "always" || this.tickLabels.length > 0,
                    },
                },
                ticks,
            );
        },
        genThumbContainer(value, valueWidth, isActive, isFocused, onFocus, onBlur, ref = "thumb") {
            const children = [this.genThumb()];

            const thumbLabelContent = this.genThumbLabelContent(value);
            this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent));

            return this.$createElement(
                "div",
                this.setTextColor(this.computedThumbColor, {
                    ref,
                    key: ref,
                    staticClass: "o-slider__thumb-container",
                    class: {
                        "o-slider__thumb-container--active": isActive,
                        "o-slider__thumb-container--focused": isFocused,
                        "o-slider__thumb-container--show-label": this.showThumbLabel,
                    },
                    style: this.getThumbContainerStyles(valueWidth),
                    attrs: {
                        role: "slider",
                        tabindex: this.isDisabled ? -1 : this.$attrs.tabindex ? this.$attrs.tabindex : 0,
                        "aria-label": this.label,
                        "aria-valuemin": this.min,
                        "aria-valuemax": this.max,
                        "aria-valuenow": this.internalValue,
                        "aria-readonly": String(this.isReadonly),
                        "aria-orientation": this.vertical ? "vertical" : "horizontal",
                        ...this.$attrs,
                    },
                    on: {
                        focus: onFocus,
                        blur: onBlur,
                        keydown: this.onKeyDown,
                    },
                }),
                children,
            );
        },
        genThumbLabelContent(value) {
            return this.$scopedSlots["thumb-label"] ? this.$scopedSlots["thumb-label"]({ value }) : [this.$createElement("span", [String(value)])];
        },
        genThumbLabel(content) {
            const size = convertToUnit(this.thumbSize);

            const transform = this.vertical
                ? `translateY(20%) translateY(${Number(this.thumbSize) / 3 - 1}px) translateX(55%) rotate(135deg)`
                : `translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)`;

            return this.$createElement(
                OScaleTransition,
                {
                    props: { origin: "bottom center" },
                },
                [
                    this.$createElement(
                        "div",
                        {
                            staticClass: "o-slider__thumb-label-container",
                            directives: [
                                {
                                    name: "show",
                                    value: this.isFocused || this.isActive || this.thumbLabel === "always",
                                },
                            ],
                        },
                        [
                            this.$createElement(
                                "div",
                                this.setBackgroundColor(this.computedThumbColor, {
                                    staticClass: "o-slider__thumb-label",
                                    style: {
                                        height: size,
                                        width: size,
                                        transform,
                                    },
                                }),
                                [this.$createElement("div", content)],
                            ),
                        ],
                    ),
                ],
            );
        },
        genThumb() {
            return this.$createElement(
                "div",
                this.setBackgroundColor(this.computedThumbColor, {
                    staticClass: "o-slider__thumb",
                }),
            );
        },
        getThumbContainerStyles(width) {
            const direction = this.vertical ? "top" : "left";
            let value = this.$vanilla.rtl ? 100 - width : width;
            value = this.vertical ? 100 - value : value;

            return {
                transition: this.trackTransition,
                [direction]: `${value}%`,
            };
        },
        onSliderMouseDown(e) {
            e.preventDefault();

            this.oldValue = this.internalValue;
            this.isActive = true;

            const mouseUpOptions = passiveSupported ? { passive: true, capture: true } : true;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;

            if (e.target?.matches(".o-slider__thumb-container, .o-slider__thumb-container *")) {
                this.thumbPressed = true;
            } else {
                window.clearTimeout(this.mouseTimeout);
                this.mouseTimeout = window.setTimeout(() => {
                    this.thumbPressed = true;
                }, 300);
            }

            if ("touches" in e) {
                this.app.addEventListener("touchmove", this.onMouseMove, mouseMoveOptions);
                addOnceEventListener(this.app, "touchend", this.onSliderMouseUp, mouseUpOptions);
            } else {
                this.onMouseMove(e);
                this.app.addEventListener("mousemove", this.onMouseMove, mouseMoveOptions);
                addOnceEventListener(this.app, "mouseup", this.onSliderMouseUp, mouseUpOptions);
            }

            this.$emit("start", this.internalValue);
        },
        onSliderMouseUp(e) {
            e.stopPropagation();
            window.clearTimeout(this.mouseTimeout);
            this.thumbPressed = false;
            const mouseMoveOptions = passiveSupported ? { passive: true } : false;
            this.app.removeEventListener("touchmove", this.onMouseMove, mouseMoveOptions);
            this.app.removeEventListener("mousemove", this.onMouseMove, mouseMoveOptions);

            this.$emit("mouseup", e);
            this.$emit("end", this.internalValue);
            if (!deepEqual(this.oldValue, this.internalValue)) {
                this.$emit("change", this.internalValue);
                this.noClick = true;
            }

            this.isActive = false;
        },
        onMouseMove(e) {
            if (e.type === "mousemove") {
                this.thumbPressed = true;
            }
            this.internalValue = this.parseMouseMove(e);
        },
        onKeyDown(e) {
            if (!this.isInteractive) return;

            const value = this.parseKeyDown(e, this.internalValue);

            if (value == null || value < this.minValue || value > this.maxValue) return;

            this.internalValue = value;
            this.$emit("change", value);
        },
        onSliderClick(e) {
            if (this.noClick) {
                this.noClick = false;
                return;
            }
            const thumb = this.$refs.thumb;
            thumb.focus();

            this.onMouseMove(e);
            this.$emit("change", this.internalValue);
        },
        onBlur(e) {
            this.isFocused = false;

            this.$emit("blur", e);
        },
        onFocus(e) {
            this.isFocused = true;

            this.$emit("focus", e);
        },
        parseMouseMove(e) {
            const start = this.vertical ? "top" : "left";
            const length = this.vertical ? "height" : "width";
            const click = this.vertical ? "clientY" : "clientX";

            const { [start]: trackStart, [length]: trackLength } = this.$refs.track.getBoundingClientRect();
            const clickOffset = "touches" in e ? e.touches[0][click] : e[click]; // Can we get rid of any here?

            // It is possible for left to be NaN, force to number
            let clickPos = Math.min(Math.max((clickOffset - trackStart) / trackLength, 0), 1) || 0;

            if (this.vertical) clickPos = 1 - clickPos;
            if (this.$vanilla.rtl) clickPos = 1 - clickPos;

            return parseFloat(this.min) + clickPos * (this.maxValue - this.minValue);
        },
        parseKeyDown(e, value) {
            if (!this.isInteractive) {
                return;
            }

            const { pageup, pagedown, end, home, left, right, down, up } = KeyCodes;

            if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode)) {
                return;
            }

            e.preventDefault();
            const step = this.stepNumeric || 1;
            const steps = (this.maxValue - this.minValue) / step;
            if ([left, right, down, up].includes(e.keyCode)) {
                const increase = this.$vanilla.rtl ? [left, up] : [right, up];
                const direction = increase.includes(e.keyCode) ? 1 : -1;
                const multiplier = e.shiftKey ? 3 : e.ctrlKey ? 2 : 1;

                value = value + direction * step * multiplier;
            } else if (e.keyCode === home) {
                value = this.minValue;
            } else if (e.keyCode === end) {
                value = this.maxValue;
            } else {
                const direction = e.keyCode === pagedown ? 1 : -1;
                value = value - direction * step * (steps > 100 ? steps / 10 : 10);
            }

            return value;
        },
        roundValue(value) {
            if (!this.stepNumeric) {
                return value;
            }
            // Format input value using the same number
            // of decimals places as in the step prop
            const trimmedStep = this.step.toString().trim();
            const decimals = trimmedStep.indexOf(".") > -1 ? trimmedStep.length - trimmedStep.indexOf(".") - 1 : 0;
            const offset = this.minValue % this.stepNumeric;

            const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset;

            return parseFloat(Math.min(newValue, this.maxValue).toFixed(decimals));
        },
    },
});