// Styles
import "./OCarousel.scss";

// Mixins
// TODO: Move this into core components v2.0
import ButtonGroup from "../../mixins/button-group";
import { breaking } from "../../utils/console";
// Utils
import { convertToUnit } from "../../utils/helpers";
// Components
import OBtn from "../OBtn/OBtn";
import OIcon from "../OIcon/OIcon";
import OProgressBar from "../OProgress/OProgressBar";
// Extensions
import OWindow from "../OWindow/OWindow";

export default OWindow.extend({
    name: "OCarousel",
    props: {
        continuous: {
            type: Boolean,
            default: true,
        },
        cycle: Boolean,
        delimiterIcon: {
            type: String,
            default: "$delimiter",
        },
        height: {
            type: [Number, String],
            default: 500,
        },
        hideDelimiters: Boolean,
        hideDelimiterBackground: Boolean,
        interval: {
            type: [Number, String],
            default: 6000,
            validator: (value) => value > 0,
        },
        mandatory: {
            type: Boolean,
            default: true,
        },
        progress: Boolean,
        progressColor: String,
        showArrows: {
            type: Boolean,
            default: true,
        },
        verticalDelimiters: {
            type: String,
            default: undefined,
        },
    },
    data() {
        return {
            internalHeight: this.height,
            slideTimeout: undefined,
        };
    },
    computed: {
        classes() {
            return {
                ...OWindow.options.computed.classes.call(this),
                "o-carousel": true,
                "o-carousel--hide-delimiter-background": this.hideDelimiterBackground,
                "o-carousel--vertical-delimiters": this.isVertical,
            };
        },
        isDark() {
            return this.dark || !this.light;
        },
        isVertical() {
            return this.verticalDelimiters != null;
        },
    },
    watch: {
        internalValue: "restartTimeout",
        interval: "restartTimeout",
        height(val, oldVal) {
            if (val === oldVal || !val) return;
            this.internalHeight = val;
        },
        cycle(val) {
            if (val) {
                this.restartTimeout();
            } else {
                clearTimeout(this.slideTimeout);
                this.slideTimeout = undefined;
            }
        },
    },
    created() {
        if (this.$attrs.hasOwnProperty("hide-controls")) {
            breaking("hide-controls", ':show-arrows="false"', this);
        }
    },
    mounted() {
        this.startTimeout();
    },
    methods: {
        genControlIcons() {
            if (this.isVertical) return null;

            return OWindow.options.methods.genControlIcons.call(this);
        },
        genDelimiters() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-carousel__controls",
                    style: {
                        left: this.verticalDelimiters === "left" && this.isVertical ? 0 : "auto",
                        right: this.verticalDelimiters === "right" ? 0 : "auto",
                    },
                },
                [this.genItems()],
            );
        },
        genItems() {
            const length = this.items.length;
            const children = [];

            for (let i = 0; i < length; i++) {
                const child = this.$createElement(
                    OBtn,
                    {
                        staticClass: "o-carousel__controls__item",
                        attrs: {
                            "aria-label": this.$t.args("$vanilla.carousel.aria-label.delimiter", i + 1, length),
                        },
                        props: {
                            icon: true,
                            small: true,
                            value: this.getValue(this.items[i], i),
                        },
                    },
                    [
                        this.$createElement(
                            OIcon,
                            {
                                props: { size: 18 },
                            },
                            this.delimiterIcon,
                        ),
                    ],
                );

                children.push(child);
            }

            return this.$createElement(
                ButtonGroup,
                {
                    props: {
                        value: this.internalValue,
                        mandatory: this.mandatory,
                    },
                    on: {
                        change: (val) => {
                            this.internalValue = val;
                        },
                    },
                },
                children,
            );
        },
        genProgress() {
            return this.$createElement(OProgressBar, {
                staticClass: "o-carousel__progress",
                props: {
                    color: this.progressColor,
                    value: ((this.internalIndex + 1) / this.items.length) * 100,
                },
            });
        },
        restartTimeout() {
            this.slideTimeout && clearTimeout(this.slideTimeout);
            this.slideTimeout = undefined;

            window.requestAnimationFrame(this.startTimeout);
        },
        startTimeout() {
            if (!this.cycle) return;

            this.slideTimeout = window.setTimeout(this.next, +this.interval > 0 ? +this.interval : 6000);
        },
    },
    render(h) {
        const render = OWindow.options.render.call(this, h);

        render.data.style = `height: ${convertToUnit(this.height)};`;

        if (!this.hideDelimiters) {
            render.children.push(this.genDelimiters());
        }

        if (this.progress || this.progressColor) {
            render.children.push(this.genProgress());
        }

        return render;
    },
});
