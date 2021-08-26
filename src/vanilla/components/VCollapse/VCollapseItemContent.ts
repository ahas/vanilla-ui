// Components
import VExpansionPanel from "./VCollapseItem";
import { VExpandTransition } from "../transitions";

// Mixins
import Bootable from "../../mixins/bootable";
import Colorable from "../../mixins/colorable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Utilities
import { getSlot } from "../../utils/helpers";
import mixins, { ExtractVue } from "../../utils/mixins";

// Types
import Vue, { VNode, VueConstructor } from "vue";

const BaseMixins = mixins(Bootable, Colorable, RegistrableInject<"collapse", VueConstructor<Vue>>("collapse", "v-collapse-item-content", "v-collapse-item"));

interface options extends ExtractVue<typeof BaseMixins> {
    expansionPanel: InstanceType<typeof VExpansionPanel>;
}

/* @vue/component */
export default BaseMixins.extend<options>().extend({
    name: "v-collapse-item-content",
    data: () => ({
        isActive: false,
    }),
    computed: {
        parentIsActive(): boolean {
            return this.expansionPanel.isActive;
        },
    },
    watch: {
        parentIsActive: {
            immediate: true,
            handler(val, oldVal) {
                if (val) this.isBooted = true;

                if (oldVal == null) this.isActive = val;
                else this.$nextTick(() => (this.isActive = val));
            },
        },
    },
    created() {
        this.expansionPanel.registerContent(this);
    },
    beforeDestroy() {
        this.expansionPanel.unregisterContent();
    },
    render(h): VNode {
        return h(
            VExpandTransition,
            this.showLazyContent(() => [
                h(
                    "div",
                    this.setBackgroundColor(this.color, {
                        staticClass: "v-collapse-item-content",
                        directives: [
                            {
                                name: "show",
                                value: this.isActive,
                            },
                        ],
                    }),
                    [h("div", { class: "v-collapse-item-content__wrap" }, getSlot(this))],
                ),
            ]),
        );
    },
});
