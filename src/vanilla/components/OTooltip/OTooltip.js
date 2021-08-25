import Vue from "vue";

import "./OTooltip.scss";

// Mixins
import Activatable from "../../mixins/activatable";
import Colorable from "../../mixins/colorable";
import Delayable from "../../mixins/delayable";
import Dependent from "../../mixins/dependent";
import Detachable from "../../mixins/detachable";
import Menuable from "../../mixins/menuable";
import Toggleable from "../../mixins/toggleable";

// Helpers
import { convertToUnit, KeyCodes, getSlotType } from "../../utils/helpers";
import { consoleError } from "../../utils/console";

export default Vue.extend({
    name: "OTooltip",
    mixins: [Colorable, Delayable, Dependent, Detachable, Menuable, Toggleable],
    props: {
        closeDelay: {
            type: [Number, String],
            default: 0,
        },
        disabled: Boolean,
        fixed: {
            type: Boolean,
            default: true,
        },
        openDelay: {
            type: [Number, String],
            default: 0,
        },
        openOnHover: {
            type: Boolean,
            default: true,
        },
        tag: {
            type: String,
            default: "span",
        },
        transition: String,
    },
    data: () => ({
        calculatedMinWidth: 0,
        closeDependents: false,
    }),
    computed: {
        calculatedLeft() {
            const { activator, content } = this.dimensions;
            const unknown = !this.bottom && !this.left && !this.top && !this.right;
            const activatorLeft = this.attach !== false ? activator.offsetLeft : activator.left;
            let left = 0;

            if (this.top || this.bottom || unknown) {
                left = activatorLeft + activator.width / 2 - content.width / 2;
            } else if (this.left || this.right) {
                left = activatorLeft + (this.right ? activator.width : -content.width) + (this.right ? 10 : -10);
            }

            if (this.nudgeLeft) left -= parseInt(this.nudgeLeft);
            if (this.nudgeRight) left += parseInt(this.nudgeRight);

            return `${this.calcXOverflow(left, this.dimensions.content.width)}px`;
        },
        calculatedTop() {
            const { activator, content } = this.dimensions;
            const activatorTop = this.attach !== false ? activator.offsetTop : activator.top;
            let top = 0;

            if (this.top || this.bottom) {
                top = activatorTop + (this.bottom ? activator.height : -content.height) + (this.bottom ? 10 : -10);
            } else if (this.left || this.right) {
                top = activatorTop + activator.height / 2 - content.height / 2;
            }

            if (this.nudgeTop) top -= parseInt(this.nudgeTop);
            if (this.nudgeBottom) top += parseInt(this.nudgeBottom);

            return `${this.calcYOverflow(top + this.pageYOffset)}px`;
        },
        classes() {
            return {
                "o-tooltip--top": this.top,
                "o-tooltip--right": this.right,
                "o-tooltip--bottom": this.bottom,
                "o-tooltip--left": this.left,
                "o-tooltip--attached": this.attach === "" || this.attach === true || this.attach === "attach",
            };
        },
        computedTransition() {
            if (this.transition) return this.transition;

            return this.isActive ? "scale-transition" : "fade-transition";
        },
        offsetY() {
            return this.top || this.bottom;
        },
        offsetX() {
            return this.left || this.right;
        },
        styles() {
            return {
                left: this.calculatedLeft,
                maxWidth: convertToUnit(this.maxWidth),
                minWidth: convertToUnit(this.minWidth),
                opacity: this.isActive ? 0.9 : 0,
                top: this.calculatedTop,
                zIndex: this.zIndex || this.activeZIndex,
            };
        },
    },
    beforeMount() {
        this.$nextTick(() => {
            this.value && this.callActivate();
        });
    },
    mounted() {
        if (getSlotType(this, "activator", true) === "v-slot") {
            consoleError(`o-tooltip's activator slot must be bound, try '<template #activator="data"><o-btn v-on="data.on>'`, this);
        }
    },
    methods: {
        activate() {
            // Update coordinates and dimensions of menu
            // and its activator
            this.updateDimensions();
            // Start the transition
            requestAnimationFrame(this.startTransition);
        },
        deactivate() {
            this.runDelay("close");
        },
        genActivatorListeners() {
            const listeners = Activatable.options.methods.genActivatorListeners.call(this);

            listeners.focus = (e) => {
                this.getActivator(e);
                this.runDelay("open");
            };
            listeners.blur = (e) => {
                this.getActivator(e);
                this.runDelay("close");
            };
            listeners.keydown = (e) => {
                if (e.keyCode === KeyCodes.esc) {
                    this.getActivator(e);
                    this.runDelay("close");
                }
            };

            return listeners;
        },
        genActivatorAttributes() {
            return {
                "aria-haspopup": true,
                "aria-expanded": String(this.isActive),
            };
        },
        genTransition() {
            const content = this.genContent();

            if (!this.computedTransition) return content;

            return this.$createElement(
                "transition",
                {
                    props: {
                        name: this.computedTransition,
                    },
                },
                [content],
            );
        },
        genContent() {
            return this.$createElement(
                "div",
                this.setBackgroundColor(this.color, {
                    staticClass: "o-tooltip__content",
                    class: {
                        [this.contentClass]: true,
                        menuable__content__active: this.isActive,
                        "o-tooltip__content--fixed": this.activatorFixed,
                    },
                    style: this.styles,
                    attrs: this.getScopeIdAttrs(),
                    directives: [
                        {
                            name: "show",
                            value: this.isContentActive,
                        },
                    ],
                    ref: "content",
                }),
                this.getContentSlot(),
            );
        },
    },
    render(h) {
        return h(
            this.tag,
            {
                staticClass: "o-tooltip",
                class: this.classes,
            },
            [this.showLazyContent(() => [this.genTransition()]), this.genActivator()],
        );
    },
});
