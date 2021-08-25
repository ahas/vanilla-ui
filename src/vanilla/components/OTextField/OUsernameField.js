import OTextField from "./OTextField";

export default OTextField.extend({
    props: {
        email: Boolean,
    },
    render(h) {
        return h(OTextField, {
            props: {
                rules: [this.email ? (v) => (v && v.length > 0 ? reg(/.+@.+\..+/, "email")(v) : true) : true, ...(this.rules || [])],
                placeholder: this.$t("$vanilla.label." + (this.email ? "email" : "username")),
                prependIcon: this.email ? "mdi-email" : "mdi-account",
            },
            attrs: this.$attrs,
            on: this.$listeners,
        });
    },
});
