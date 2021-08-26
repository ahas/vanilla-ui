// Components
import VExpansionPanels from "./VCollapse";
import VExpansionPanelHeader from "./VCollapseItemHeader";
import VExpansionPanelContent from "./VCollapseItemContent";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";
import { provide as RegistrableProvide } from "../../mixins/registrable";

// Utilities
import { getSlot } from "../../utils/helpers";
import mixins from "../../utils/mixins";

// Types
import { VNode } from "vue";

type VExpansionPanelHeaderInstance = InstanceType<typeof VExpansionPanelHeader>;
type VExpansionPanelContentInstance = InstanceType<typeof VExpansionPanelContent>;

export default mixins(
    GroupableFactory<"collapse", typeof VExpansionPanels>("collapse", "v-collapse-item", "v-collapse-items"),
    RegistrableProvide("expansionPanel", true),
    /* @vue/component */
).extend({
    name: "v-collapse-item",
    props: {
        disabled: Boolean,
        readonly: Boolean,
    },
    data() {
        return {
            content: null as VExpansionPanelContentInstance | null,
            header: null as VExpansionPanelHeaderInstance | null,
            nextIsActive: false,
        };
    },
    computed: {
        classes(): object {
            return {
                "v-collapse-item--active": this.isActive,
                "v-collapse-item--next-active": this.nextIsActive,
                "v-collapse-item--disabled": this.isDisabled,
                ...this.groupClasses,
            };
        },
        isDisabled(): boolean {
            return this.collapse.disabled || this.disabled;
        },
        isReadonly(): boolean {
            return this.collapse.readonly || this.readonly;
        },
    },
    methods: {
        registerContent(vm: VExpansionPanelContentInstance) {
            this.content = vm;
        },
        unregisterContent() {
            this.content = null;
        },
        registerHeader(vm: VExpansionPanelHeaderInstance) {
            this.header = vm;
            vm.$on("click", this.onClick);
        },
        unregisterHeader() {
            this.header = null;
        },
        onClick(e: MouseEvent) {
            if (e.detail) this.header!.$el.blur();

            this.$emit("click", e);

            this.isReadonly || this.isDisabled || this.toggle();
        },
        toggle() {
            this.$nextTick(() => this.$emit("change"));
        },
    },
    render(h): VNode {
        return h(
            "div",
            {
                staticClass: "v-collapse-item",
                class: this.classes,
                attrs: {
                    "aria-expanded": String(this.isActive),
                },
            },
            getSlot(this),
        );
    },
});
