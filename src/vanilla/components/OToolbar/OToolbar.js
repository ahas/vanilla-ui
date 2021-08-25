// Styles
import "./OToolbar.scss";

// Extensions
import OSheet from "../OSheet/OSheet";

// Utils
import { convertToUnit, getSlot } from "../../utils/helpers";
import { breaking } from "../../utils/console";

/* @vue/component */
export default OSheet.extend({
    name: "OToolbar",
    props: {
        absolute: Boolean,
        bottom: Boolean,
        collapse: Boolean,
        dense: Boolean,
        extended: Boolean,
        extensionHeight: {
            default: 48,
            type: [Number, String],
        },
        flat: Boolean,
        floating: Boolean,
        prominent: Boolean,
        short: Boolean,
        underlined: Boolean,
        src: {
            type: [String, Object],
            default: "",
        },
        tag: {
            type: String,
            default: "header",
        },
    },
    data: () => ({
        isExtended: false,
    }),
    computed: {
        computedHeight() {
            const height = this.computedContentHeight;

            if (!this.isExtended) return height;

            const extensionHeight = parseInt(this.extensionHeight);

            return this.isCollapsed ? height : height + (!isNaN(extensionHeight) ? extensionHeight : 0);
        },
        computedContentHeight() {
            if (this.height) return parseInt(this.height);
            if (this.isProminent && this.dense) return 96;
            if (this.isProminent && this.short) return 112;
            if (this.isProminent) return 128;
            if (this.dense) return 48;
            if (this.short || this.$vanilla.display.smAndDown) return 56;
            return 64;
        },
        classes() {
            return {
                ...OSheet.options.computed.classes.call(this),
                "o-toolbar": true,
                "o-toolbar--absolute": this.absolute,
                "o-toolbar--bottom": this.bottom,
                "o-toolbar--collapse": this.collapse,
                "o-toolbar--collapsed": this.isCollapsed,
                "o-toolbar--dense": this.dense,
                "o-toolbar--extended": this.isExtended,
                "o-toolbar--flat": this.flat,
                "o-toolbar--floating": this.floating,
                "o-toolbar--prominent": this.isProminent,
                "o-toolbar--underlined": this.underlined,
            };
        },
        isCollapsed() {
            return this.collapse;
        },
        isProminent() {
            return this.prominent;
        },
        styles() {
            return {
                ...this.measurableStyles,
                height: convertToUnit(this.computedHeight),
            };
        },
    },
    created() {
        const breakingProps = [
            ["app", "<o-app-bar app>"],
            ["manual-scroll", '<o-app-bar :value="false">'],
            ["clipped-left", "<o-app-bar clipped-left>"],
            ["clipped-right", "<o-app-bar clipped-right>"],
            ["inverted-scroll", "<o-app-bar inverted-scroll>"],
            ["scroll-off-screen", "<o-app-bar scroll-off-screen>"],
            ["scroll-target", "<o-app-bar scroll-target>"],
            ["scroll-threshold", "<o-app-bar scroll-threshold>"],
            ["card", "<o-app-bar flat>"],
        ];

        breakingProps.forEach(([original, replacement]) => {
            if (this.$attrs.hasOwnProperty(original)) breaking(original, replacement, this);
        });
    },
    methods: {
        genBackground() {
            const props = {
                height: convertToUnit(this.computedHeight),
                src: this.src,
            };

            const image = this.$scopedSlots.img ? this.$scopedSlots.img({ props }) : this.$createElement(VImg, { props });

            return this.$createElement(
                "div",
                {
                    staticClass: "o-toolbar__image",
                },
                [image],
            );
        },
        genContent() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-toolbar__content",
                    style: {
                        height: convertToUnit(this.computedContentHeight),
                    },
                },
                getSlot(this),
            );
        },
        genExtension() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-toolbar__extension",
                    style: {
                        height: convertToUnit(this.extensionHeight),
                    },
                },
                getSlot(this, "extension"),
            );
        },
    },
    render(h) {
        this.isExtended = this.extended || !!this.$scopedSlots.extension;

        const children = [this.genContent()];
        const data = this.setBackgroundColor(this.color, {
            class: this.classes,
            style: this.styles,
            on: this.$listeners,
        });

        if (this.isExtended) children.push(this.genExtension());
        if (this.src || this.$scopedSlots.img) children.unshift(this.genBackground());

        return h(this.tag, data, children);
    },
});
