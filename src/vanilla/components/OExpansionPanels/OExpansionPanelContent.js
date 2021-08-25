import Vue from "vue";

// Components
import { OExpandTransition } from "../transitions";

// Mixins
import Bootable from "../../mixins/bootable";
import Colorable from "../../mixins/colorable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Utils
import { getSlot } from "../../utils/helpers";

/* @vue/component */
export default Vue.extend({
    name: "OExpansionPanelContent",
    mixins: [Bootable, Colorable, RegistrableInject("expansionPanel", "OExpansionPanelContent", "OExpansionPanel")],
    computed: {
        isActive() {
            return this.expansionPanel.isActive;
        },
    },

    created() {
        this.expansionPanel.registerContent(this);
    },

    beforeDestroy() {
        this.expansionPanel.unregisterContent();
    },

    render(h) {
        return h(
            OExpandTransition,
            this.showLazyContent(() => [
                h(
                    "div",
                    this.setBackgroundColor(this.color, {
                        staticClass: "o-expansion-panel-content",
                        directives: [
                            {
                                name: "show",
                                value: this.isActive,
                            },
                        ],
                    }),
                    [h("div", { class: "o-expansion-panel-content__wrap" }, getSlot(this))],
                ),
            ]),
        );
    },
});
