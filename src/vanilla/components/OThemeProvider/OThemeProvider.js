// Mixins
import Themeable from "../../mixins/themeable";

/* @vue/component */
export default Themeable.extend({
    name: "OThemeProvider",
    props: { root: Boolean },
    computed: {
        isDark() {
            return this.root ? this.rootIsDark : Themeable.options.computed.isDark.call(this);
        },
    },
    render() {
        return this.$slots.default && this.$slots.default.find((node) => !node.isComment && node.text !== " ");
    },
});
