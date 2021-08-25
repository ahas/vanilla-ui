import Vue from "vue";

// Components
import OIcon from "../OIcon/OIcon";

// Mixins
import Colorable from "../../mixins/colorable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Directives
import ripple from "../../directives/ripple";

/* @vue/component */
export default Vue.extend({
    name: "OStep",
    mixins: [Colorable, RegistrableInject("steps", "o-step", "o-steps")],
    directives: { ripple },
    inject: ["stepClick"],
    props: {
        color: {
            type: String,
            default: "primary",
        },
        complete: Boolean,
        completeIcon: {
            type: String,
            default: "mdi-check",
        },
        editable: Boolean,
        editIcon: {
            type: String,
            default: "mdi-pencil",
        },
        errorIcon: {
            type: String,
            default: "mdi-alert",
        },
        rules: {
            type: Array,
            default: () => [],
        },
        step: [Number, String],
    },
    data() {
        return {
            isActive: false,
            isInactive: true,
        };
    },
    computed: {
        classes() {
            return {
                "o-steps__step--active": this.isActive,
                "o-steps__step--editable": this.editable,
                "o-steps__step--inactive": this.isInactive,
                "o-steps__step--error error--text": this.hasError,
                "o-steps__step--complete": this.complete,
            };
        },
        hasError() {
            return this.rules.some((validate) => validate() !== true);
        },
    },
    mounted() {
        this.steps && this.steps.register(this);
    },
    beforeDestroy() {
        this.steps && this.steps.unregister(this);
    },
    methods: {
        click(e) {
            e.stopPropagation();

            this.$emit("click", e);

            if (this.editable) {
                this.stepClick(this.step);
            }
        },
        genIcon(icon) {
            return this.$createElement(OIcon, icon);
        },
        genLabel() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-steps__label",
                },
                this.$slots.default,
            );
        },
        genStep() {
            const color = !this.hasError && (this.complete || this.isActive) ? this.color : false;

            return this.$createElement(
                "span",
                this.setBackgroundColor(color, {
                    staticClass: "o-steps__step__step",
                }),
                this.genStepContent(),
            );
        },
        genStepContent() {
            const children = [];

            if (this.hasError) {
                children.push(this.genIcon(this.errorIcon));
            } else if (this.complete) {
                if (this.editable) {
                    children.push(this.genIcon(this.editIcon));
                } else {
                    children.push(this.genIcon(this.completeIcon));
                }
            } else {
                children.push(String(this.step));
            }

            return children;
        },
        toggle(step) {
            console.log(step);
            this.isActive = step.toString() === this.step.toString();
            this.isInactive = Number(step) < Number(this.step);
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-steps__step",
                class: this.classes,
                directives: [
                    {
                        name: "ripple",
                        value: this.editable,
                    },
                ],
                on: { click: this.click },
            },
            [this.genStep(), this.genLabel()],
        );
    },
});
