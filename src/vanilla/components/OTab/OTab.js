import Vue from "vue";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";
import Routable from "../../mixins/routable";
import Themeable from "../../mixins/themeable";

// Utils
import { KeyCodes } from "../../utils/helpers";

export default Vue.extend({
    name: "OTab",
    mixins: [
        Routable,
        // Must be after routable
        // to overwrite activeClass
        GroupableFactory("tabsBar"),
        Themeable,
    ],
    props: {
        ripple: {
            type: [Boolean, Object],
            default: true,
        },
    },
    data: () => ({
        proxyClass: "o-tab--active",
    }),
    computed: {
        classes() {
            return {
                "o-tab": true,
                ...Routable.options.computed.classes.call(this),
                "o-tab--disabled": this.disabled,
                ...this.groupClasses,
            };
        },
        value() {
            let to = this.to || this.href || "";

            if (this.$router && this.to === Object(this.to)) {
                const resolve = this.$router.resolve(this.to, this.$route, this.append);

                to = resolve.href;
            }

            return to.replace("#", "");
        },
    },
    mounted() {
        this.onRouteChange();
    },
    methods: {
        click(e) {
            // If user provides an
            // actual link, do not
            // prevent default
            if (this.href && this.href.indexOf("#") > -1) {
                e.preventDefault();
            }

            if (e.detail) {
                this.$el.blur();
            }

            this.$emit("click", e);

            this.to || this.toggle();
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();

        data.attrs = {
            ...data.attrs,
            "aria-selected": String(this.isActive),
            role: "tab",
            tabindex: 0,
        };
        data.on = {
            ...data.on,
            keydown: (e) => {
                if (e.keyCode === KeyCodes.enter) {
                    this.click(e);
                }

                this.$emit("keydown", e);
            },
        };

        return h(tag, data, this.$slots.default);
    },
});
