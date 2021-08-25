import "./ODivider.scss";

// Mixins
import Themeable from "../../mixins/themeable";

export default Themeable.extend({
    name: "ODivider",
    props: {
        inset: Boolean,
        vertical: Boolean,
    },
    render(h) {
        // WAI-ARIA attributes
        let orientation;
        if (!this.$attrs.role || this.$attrs.role === "separator") {
            orientation = this.vertical ? "vertical" : "horizontal";
        }
        return h("hr", {
            class: {
                "o-divider": true,
                "o-divider--inset": this.inset,
                "o-divider--vertical": this.vertical,
                ...this.themeClasses,
            },
            attrs: {
                role: "separator",
                "aria-orientation": orientation,
                ...this.$attrs,
            },
            on: this.$listeners,
        });
    },
});
