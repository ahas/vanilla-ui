// Mixins
import { inject } from "../../mixins/registrable";

// Utils
import { convertToUnit } from "../../utils/helpers";
import { easeInOutCubic } from "../../services/easing-patterns";

const base = inject("OAppBar", "o-app-bar-title", "o-app-bar");

export default base.extend().extend({
    name: "OAppBarTitle",
    data: () => ({
        contentWidth: 0,
        left: 0,
        width: 0,
    }),
    watch: {
        "$vanilla.display.width": "updateDimensions",
    },
    computed: {
        styles() {
            if (!this.contentWidth) return {};

            const min = this.width;
            const max = this.contentWidth;
            const ratio = easeInOutCubic(Math.min(1, this.OAppBar.scrollRatio * 1.5));
            return {
                width: convertToUnit(min + (max - min) * ratio),
                visibility: this.OAppBar.scrollRatio ? "visible" : "hidden",
            };
        },
    },
    mounted() {
        this.updateDimensions();
    },
    methods: {
        updateDimensions() {
            const dimensions = this.$refs.placeholder.getBoundingClientRect();
            this.width = dimensions.width;
            this.left = dimensions.left;
            this.contentWidth = this.$refs.content.scrollWidth;
        },
    },
    render(h) {
        return h(
            "div",
            {
                class: "o-toolbar__title o-app-bar-title",
            },
            [
                h(
                    "div",
                    {
                        class: "o-app-bar-title__content",
                        style: this.styles,
                        ref: "content",
                    },
                    [this.$slots.default],
                ),
                h(
                    "div",
                    {
                        class: "o-app-bar-title__placeholder",
                        style: {
                            visibility: this.OAppBar.scrollRatio ? "hidden" : "visible",
                        },
                        ref: "placeholder",
                    },
                    [this.$slots.default],
                ),
            ],
        );
    },
});
