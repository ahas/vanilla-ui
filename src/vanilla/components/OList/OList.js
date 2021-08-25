import "./OList.scss";
// Components
import OSheet from "../OSheet/OSheet";

/* @vue/component */
export default OSheet.extend({
    name: "OList",
    provide() {
        return {
            isInList: true,
            list: this,
        };
    },
    inject: {
        isInMenu: {
            default: false,
        },
        isInNav: {
            default: false,
        },
    },
    props: {
        dense: Boolean,
        disabled: Boolean,
        expand: Boolean,
        flat: Boolean,
        nav: Boolean,
        rounded: Boolean,
        subheader: Boolean,
        threeLine: Boolean,
        twoLine: Boolean,
    },
    data: () => ({
        groups: [],
    }),
    computed: {
        classes() {
            return {
                ...OSheet.options.computed.classes.call(this),
                "o-list--dense": this.dense,
                "o-list--disabled": this.disabled,
                "o-list--flat": this.flat,
                "o-list--nav": this.nav,
                "o-list--rounded": this.rounded,
                "o-list--subheader": this.subheader,
                "o-list--two-line": this.twoLine,
                "o-list--three-line": this.threeLine,
            };
        },
    },
    methods: {
        register(content) {
            this.groups.push(content);
        },
        unregister(content) {
            const index = this.groups.findIndex((g) => g._uid === content._uid);

            if (index > -1) this.groups.splice(index, 1);
        },
        listClick(uid) {
            if (this.expand) return;

            for (const group of this.groups) {
                group.toggle(uid);
            }
        },
    },
    render(h) {
        const data = {
            staticClass: "o-list",
            class: this.classes,
            style: this.styles,
            attrs: {
                role: this.isInNav || this.isInMenu ? undefined : "list",
                ...this.attrs$,
            },
        };

        return h(this.tag, this.setBackgroundColor(this.color, data), [this.$slots.default]);
    },
});
