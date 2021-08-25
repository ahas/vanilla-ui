import Vue from "vue";

import ODatePicker from "../ODatePicker/ODatePicker";
import OMenu from "../OMenu/OMenu";
import OTextField from "./OTextField";

export default Vue.extend({
    props: {
        value: { type: [String, Date, Object] },
    },
    data() {
        return {
            date: this.$moment().format("YYYY-MM-DD"),
            menu: false,
        };
    },
    watch: {
        value: {
            handler() {
                this.date = this.$moment(this.value || new Date()).format("YYYY-MM-DD");
            },
            immediate: true,
        },
    },
    methods: {
        save() {
            this.$refs.menu.save(this.date);
            this.$emit("input", this.date);
        },
        input(e) {
            this.date = e;
            this.menu = false;
            this.save();
            this.$emit("change", e);
        },
    },
    render(h) {
        return h(
            OMenu,
            {
                ref: "menu",
                props: {
                    value: this.menu,
                    closeOnContentClick: false,
                    returnValue: this.date,
                    minWidth: "290px",
                },
                on: {
                    input: (menu) => (this.menu = menu),
                    "update:returnValue": (date) => (this.date = date),
                },
                scopedSlots: {
                    activator: ({ on }) => {
                        return this.$createElement(OTextField, {
                            attrs: this.$attrs,
                            props: {
                                readonly: true,
                                prependIcon: "mdi-calendar",
                                value: this.date,
                                // rules: [(v) => /^([1-9][0-9]{3})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])?$/.test(v)]
                                disabled: this.$attrs.disabled,
                            },
                            on: {
                                ...on,
                                input: this.input,
                            },
                        });
                    },
                },
            },
            [
                this.$createElement(ODatePicker, {
                    attrs: this.$attrs,
                    props: {
                        noTitle: true,
                        scrollable: true,
                        value: this.date,
                        min: this.min,
                        max: this.max,
                    },
                    on: {
                        input: this.input,
                    },
                }),
            ],
        );
    },
});
