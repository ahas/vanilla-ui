import Vue from "vue";

// Styles
import "./OSteps.scss";

// Mixins
import { provide as RegistrableProvide } from "../../mixins/registrable";
import Proxyable from "../../mixins/proxyable";
import Themeable from "../../mixins/themeable";

// Utils
import { breaking } from "../../utils/console";

export default Vue.extend({
    name: "OSteps",
    mixins: [RegistrableProvide("steps"), Proxyable, Themeable],
    provide() {
        return {
            stepClick: this.stepClick,
            isVertical: this.vertical,
        };
    },
    props: {
        altLabels: Boolean,
        nonLinear: Boolean,
        vertical: Boolean,
    },
    data() {
        const data = {
            isBooted: false,
            steps: [],
            content: [],
            isReverse: false,
        };

        data.internalLazyValue = this.value != null ? this.value : data[0]?.step || 1;

        return data;
    },
    computed: {
        classes() {
            return {
                "o-steps--is-booted": this.isBooted,
                "o-steps--vertical": this.vertical,
                "o-steps--alt-labels": this.altLabels,
                "o-steps--non-linear": this.nonLinear,
                ...this.themeClasses,
            };
        },
    },
    watch: {
        internalValue(val, oldVal) {
            this.isReverse = Number(val) < Number(oldVal);

            oldVal && (this.isBooted = true);

            this.updateView();
        },
    },

    created() {
        if (this.$listeners.input) {
            breaking("@input", "@change", this);
        }
    },
    mounted() {
        this.updateView();
    },
    methods: {
        register(item) {
            if (item.$options.name === "OStep") {
                this.steps.push(item);
            } else if (item.$options.name === "OStepContent") {
                item.isVertical = this.vertical;
                this.content.push(item);
            }
        },
        unregister(item) {
            if (item.$options.name === "OStep") {
                this.steps = this.steps.filter((i) => i !== item);
            } else if (item.$options.name === "OStepContent") {
                item.isVertical = this.vertical;
                this.content = this.content.filter((i) => i !== item);
            }
        },
        stepClick(step) {
            this.$nextTick(() => (this.internalValue = step));
        },
        updateView() {
            for (let index = this.steps.length; --index >= 0; ) {
                this.steps[index].toggle(this.internalValue);
            }
            for (let index = this.content.length; --index >= 0; ) {
                this.content[index].toggle(this.internalValue, this.isReverse);
            }
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-steps",
                class: this.classes,
            },
            this.$slots.default,
        );
    },
});
