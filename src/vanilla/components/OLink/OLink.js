import "./OLink.scss";
import Vue from "vue";

// Utils
import { getObjectValueByPath } from "../../utils/helpers";

const SimpleRoutable = Vue.extend({
    props: {
        activeClass: String,
        append: Boolean,
        disabled: Boolean,
        exact: {
            type: Boolean,
            default: undefined,
        },
        exactActiveClass: String,
        link: Boolean,
        href: [String, Object],
        to: [String, Object],
        nuxt: Boolean,
        replace: Boolean,
        tag: String,
        target: String,
    },
    data: () => ({
        isActive: false,
        proxyClass: "",
    }),
    computed: {
        classes() {
            const classes = {};
            if (this.to) return classes;
            if (this.activeClass) classes[this.activeClass] = this.isActive;
            if (this.proxyClass) classes[this.proxyClass] = this.isActive;
            return classes;
        },
        isClickable() {
            if (this.disabled) return false;
            return Boolean(this.isLink || this.$listeners.click || this.$listeners["!click"] || this.$attrs.tabindex);
        },
        isLink() {
            return this.to || this.href || this.link;
        },
        styles: () => ({}),
    },
    watch: {
        $route: "onRouteChange",
    },
    methods: {
        click(e) {
            this.$emit("click", e);
        },
        generateRouteLink() {
            let exact = this.exact;
            let tag;
            const data = {
                attrs: {
                    tabindex: "tabindex" in this.$attrs ? this.$attrs.tabindex : undefined,
                },
                class: this.classes,
                style: this.styles,
                props: {},
                [this.to ? "nativeOn" : "on"]: Object.assign(Object.assign({}, this.$listeners), { click: this.click }),
                ref: "link",
            };
            if (typeof this.exact === "undefined") {
                exact = this.to === "/" || (this.to === Object(this.to) && this.to.path === "/");
            }
            if (this.to) {
                // Add a special activeClass hook
                // for component level styles
                let activeClass = this.activeClass;
                let exactActiveClass = this.exactActiveClass || activeClass;
                if (this.proxyClass) {
                    activeClass = `${activeClass} ${this.proxyClass}`.trim();
                    exactActiveClass = `${exactActiveClass} ${this.proxyClass}`.trim();
                }
                tag = this.nuxt ? "nuxt-link" : "router-link";
                Object.assign(data.props, {
                    to: this.to,
                    exact,
                    activeClass,
                    exactActiveClass,
                    append: this.append,
                    replace: this.replace,
                });
            } else {
                tag = (this.href && "a") || this.tag || "div";
                if (tag === "a" && this.href) data.attrs.href = this.href;
            }
            if (this.target) data.attrs.target = this.target;
            return { tag, data };
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link || !this.$route) return;
            const activeClass = `${this.activeClass} ${this.proxyClass || ""}`.trim();
            const path = `_vnode.data.class.${activeClass}`;
            this.$nextTick(() => {
                if (getObjectValueByPath(this.$refs.link, path)) {
                    this.toggle();
                }
            });
        },
        toggle: () => {},
    },
});

export default Vue.extend({
    name: "OLink",
    mixins: [SimpleRoutable],
    computed: {
        classes() {
            return {
                "o-link": true,
                ...SimpleRoutable.options.computed.classes.call(this),
            };
        },
    },
    render(h) {
        const { tag, data } = this.generateRouteLink();
        const children = [];
        if (!this.$slots.default) {
            children.push(this.$t("$vanilla.link.empty"));
        } else if (this.$slots.default.length == 1) {
            const text = this.$slots.default[0].text;
            if (text === null || text === "undefined") {
                children.push(this.$t("$vanilla.link.unknown"));
            } else if (text.length == 0) {
                children.push(this.$t("$vanilla.link.empty"));
            } else {
                children.push(text);
            }
        } else {
            children.push(...this.$slots.default);
        }
        return h(tag, data, children);
    },
});
