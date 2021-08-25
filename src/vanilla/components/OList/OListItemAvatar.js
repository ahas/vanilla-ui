// Components
import OAvatar from "../OAvatar/OAvatar";

/* @vue/component */
export default OAvatar.extend({
    name: "OListItemAvatar",
    props: {
        horizontal: Boolean,
        size: {
            type: [Number, String],
            default: 40,
        },
    },
    computed: {
        classes() {
            return {
                "o-list-item__avatar--horizontal": this.horizontal,
                ...OAvatar.options.computed.classes.call(this),
                "o-avatar--tile": this.tile || this.horizontal,
            };
        },
    },
    render(h) {
        const render = OAvatar.options.render.call(this, h);

        render.data = render.data || {};
        render.data.staticClass += " o-list-item__avatar";

        return render;
    },
});
