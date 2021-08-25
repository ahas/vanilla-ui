import Vue from "vue";

// Styles
import "./OAppBar.scss";

// Extensions
import OToolBar from "../OToolbar/OToolbar";

// Directives
import Scroll from "../../directives/scroll";

// Mixins
import Applicationable from "../../mixins/applicationable";
import Scrollable from "../../mixins/scrollable";
import SSRBootable from "../../mixins/ssr-bootable";
import Toggleable from "../../mixins/toggleable";

// Utils
import { convertToUnit } from "../../utils/helpers";

/* @vue/component */
export default Vue.extend({
    name: "o-app-bar",
    mixins: [
        OToolBar,
        Scrollable,
        SSRBootable,
        Toggleable,
        Applicationable("top", ["clippedLeft", "clippedRight", "computedHeight", "invertedScroll", "isExtended", "isProminent", "value"]),
    ],
    directives: { Scroll },
    provide() {
        return { VAppBar: this };
    },
    props: {
        clippedLeft: Boolean,
        clippedRight: Boolean,
        collapseOnScroll: Boolean,
        elevateOnScroll: Boolean,
        fadeImgOnScroll: Boolean,
        hideOnScroll: Boolean,
        invertedScroll: Boolean,
        scrollOffScreen: Boolean,
        shrinkOnScroll: Boolean,
        value: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isActive: this.value,
        };
    },
    computed: {
        applicationProperty() {
            return !this.bottom ? "top" : "bottom";
        },
        canScroll() {
            return (
                Scrollable.options.computed.canScroll.call(this) &&
                (this.invertedScroll ||
                    this.elevateOnScroll ||
                    this.hideOnScroll ||
                    this.collapseOnScroll ||
                    this.isBooted ||
                    // If falsy, user has provided an
                    // explicit value which should
                    // overwrite anything we do
                    !this.value)
            );
        },
        classes() {
            return {
                ...OToolBar.options.computed.classes.call(this),
                "o-toolbar--collapse": this.collapse || this.collapseOnScroll,
                "o-app-bar": true,
                "o-app-bar--clipped": this.clippedLeft || this.clippedRight,
                "o-app-bar--fade-img-on-scroll": this.fadeImgOnScroll,
                "o-app-bar--elevate-on-scroll": this.elevateOnScroll,
                "o-app-bar--fixed": !this.absolute && (this.app || this.fixed),
                "o-app-bar--hide-shadow": this.hideShadow,
                "o-app-bar--is-scrolled": this.currentScroll > 0,
                "o-app-bar--shrink-on-scroll": this.shrinkOnScroll,
            };
        },
        scrollRatio() {
            const threshold = this.computedScrollThreshold;
            return Math.max((threshold - this.currentScroll) / threshold, 0);
        },
        computedContentHeight() {
            if (!this.shrinkOnScroll) return OToolBar.options.computed.computedContentHeight.call(this);

            const min = this.dense ? 48 : 56;
            const max = this.computedOriginalHeight;

            return min + (max - min) * this.scrollRatio;
        },
        computedFontSize() {
            if (!this.isProminent) {
                return undefined;
            }
            const min = 1.25;
            const max = 1.5;

            return min + (max - min) * this.scrollRatio;
        },
        computedLeft() {
            if (!this.app || this.clippedLeft) {
                return 0;
            }

            return this.$vanilla.application.left;
        },
        computedMarginTop() {
            if (!this.app) {
                return 0;
            }

            return this.$vanilla.application.bar;
        },
        computedOpacity() {
            if (!this.fadeImgOnScroll) {
                return undefined;
            }

            return this.scrollRatio;
        },
        computedOriginalHeight() {
            let height = OToolBar.options.computed.computedContentHeight.call(this);
            if (this.isExtended) height += parseInt(this.extensionHeight);
            return height;
        },
        computedRight() {
            if (!this.app || this.clippedRight) return 0;

            return this.$vanilla.application.right;
        },
        computedScrollThreshold() {
            if (this.scrollThreshold) return Number(this.scrollThreshold);

            return this.computedOriginalHeight - (this.dense ? 48 : 56);
        },
        computedTransform() {
            if (!this.canScroll || (this.elevateOnScroll && this.currentScroll === 0 && this.isActive)) return 0;

            if (this.isActive) return 0;

            const scrollOffScreen = this.scrollOffScreen ? this.computedHeight : this.computedContentHeight;

            return this.bottom ? scrollOffScreen : -scrollOffScreen;
        },
        hideShadow() {
            if (this.elevateOnScroll && this.isExtended) {
                return this.currentScroll < this.computedScrollThreshold;
            }

            if (this.elevateOnScroll) {
                return this.currentScroll === 0 || this.computedTransform < 0;
            }

            return (!this.isExtended || this.scrollOffScreen) && this.computedTransform !== 0;
        },
        isCollapsed() {
            if (!this.collapseOnScroll) {
                return OToolBar.options.computed.isCollapsed.call(this);
            }

            return this.currentScroll > 0;
        },
        isProminent() {
            return OToolBar.options.computed.isProminent.call(this) || this.shrinkOnScroll;
        },
        styles() {
            return {
                ...OToolBar.options.computed.styles.call(this),
                fontSize: convertToUnit(this.computedFontSize, "rem"),
                marginTop: convertToUnit(this.computedMarginTop),
                transform: `translateY(${convertToUnit(this.computedTransform)})`,
                left: convertToUnit(this.computedLeft),
                right: convertToUnit(this.computedRight),
            };
        },
    },
    watch: {
        canScroll: "onScroll",
        computedTransform() {
            // Normally we do not want the o-app-bar
            // to update the application top value
            // to avoid screen jump. However, in
            // this situation, we must so that
            // the clipped drawer can update
            // its top value when scrolled
            if (!this.canScroll || (!this.clippedLeft && !this.clippedRight)) return;

            this.callUpdate();
        },
        invertedScroll(val) {
            this.isActive = !val || this.currentScroll !== 0;
        },
    },
    created() {
        if (this.invertedScroll) this.isActive = false;
    },
    methods: {
        genBackground() {
            const render = OToolBar.options.methods.genBackground.call(this);

            render.data = this._b(render.data || {}, render.tag, {
                style: { opacity: this.computedOpacity },
            });

            return render;
        },
        updateApplication() {
            return this.invertedScroll ? 0 : this.computedHeight + this.computedTransform;
        },
        thresholdMet() {
            if (this.invertedScroll) {
                this.isActive = this.currentScroll > this.computedScrollThreshold;
                return;
            }

            if (this.hideOnScroll) {
                this.isActive = this.isScrollingUp || this.currentScroll < this.computedScrollThreshold;
            }

            if (this.currentThreshold < this.computedScrollThreshold) return;

            this.savedScroll = this.currentScroll;
        },
    },
    render(h) {
        const render = OToolBar.options.render.call(this, h);

        render.data = render.data || {};

        if (this.canScroll) {
            render.data.directives = render.data.directives || [];
            render.data.directives.push({
                arg: this.scrollTarget,
                name: "scroll",
                value: this.onScroll,
            });
        }

        return render;
    },
});
