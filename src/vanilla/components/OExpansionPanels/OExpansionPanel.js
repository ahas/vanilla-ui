import Vue from "vue";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";
import { provide as RegistrableProvide } from "../../mixins/registrable";

// Utils
import { getSlot } from "../../utils/helpers";

export default Vue.extend({
    name: "OExpansionPanel",
    mixins: [GroupableFactory("expansionPanels", "OExpansionPanel", "OExpansionPanels"), RegistrableProvide("expansionPanel", true)],
    props: {
        disabled: Boolean,
        readonly: Boolean,
    },

    data() {
        return {
            content: null,
            header: null,
            nextIsActive: false,
        };
    },
    computed: {
        classes() {
            return {
                "o-expansion-panel--active": this.isActive,
                "o-expansion-panel--next-active": this.nextIsActive,
                "o-expansion-panel--disabled": this.isDisabled,
                ...this.groupClasses,
            };
        },
        isDisabled() {
            return this.expansionPanels.disabled || this.disabled;
        },
        isReadonly() {
            return this.expansionPanels.readonly || this.readonly;
        },
    },
    methods: {
        registerContent(vm) {
            this.content = vm;
        },
        unregisterContent() {
            this.content = null;
        },
        registerHeader(vm) {
            this.header = vm;
            vm.$on("click", this.onClick);
        },
        unregisterHeader() {
            this.header = null;
        },
        onClick(e) {
            if (e.detail) this.header.$el.blur();

            this.$emit("click", e);

            this.isReadonly || this.isDisabled || this.toggle();
        },
        toggle() {
            if (this.content) this.content.isBooted = true;
            this.$nextTick(() => this.$emit("change"));
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-expansion-panel",
                class: this.classes,
                attrs: {
                    "aria-expanded": String(this.isActive),
                },
            },
            getSlot(this),
        );
    },
});
