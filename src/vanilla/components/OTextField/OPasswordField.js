import OTextField from "./OTextField";

export default OTextField.extend({
    data() {
        return {
            showPassword: false,
        };
    },
    render(h) {
        return h(OTextField, {
            props: {
                type: this.showPassword ? "text" : "password",
                rules: [this.email ? (v) => (v && v.length > 0 ? reg(/.+@.+\..+/, "email")(v) : true) : true, ...(this.rules || [])],
                placeholder: this.$t("$vanilla.label.password"),
                prependIcon: "mdi-lock",
                appendIcon: this.showPassword ? "mdi-eye-off" : "mdi-eye",
            },
            attrs: this.$attrs,
            on: {
                ...this.$listeners,
                "click:append": () => {
                    this.showPassword = !this.showPassword;
                },
            },
        });
    },
});
