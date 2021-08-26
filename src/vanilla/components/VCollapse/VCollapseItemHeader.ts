// Components
import { VFadeTransition } from "../transitions";
import VExpansionPanel from "./VCollapseItem";
import VIcon from "../VIcon";

// Mixins
import Colorable from "../../mixins/colorable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Directives
import ripple from "../../directives/ripple";

// Utilities
import { getSlot } from "../../utils/helpers";
import mixins, { ExtractVue } from "../../utils/mixins";

// Types
import Vue, { VNode, VueConstructor } from "vue";

const baseMixins = mixins(Colorable, RegistrableInject<"collapse", VueConstructor<Vue>>("collapse", "v-collapse-item-header", "v-collapse-item"));

interface options extends ExtractVue<typeof baseMixins> {
    $el: HTMLElement;
    expansionPanel: InstanceType<typeof VExpansionPanel>;
}

export default baseMixins.extend<options>().extend({
    name: "v-collapse-item-header",
    directives: { ripple },
    props: {
        disableIconRotate: Boolean,
        expandIcon: {
            type: String,
            default: "$expand",
        },
        hideActions: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: false,
        },
    },
    data: () => ({
        hasMousedown: false,
    }),
    computed: {
        classes(): object {
            return {
                "v-collapse-item-header--active": this.isActive,
                "v-collapse-item-header--mousedown": this.hasMousedown,
            };
        },
        isActive(): boolean {
            return this.expansionPanel.isActive;
        },
        isDisabled(): boolean {
            return this.expansionPanel.isDisabled;
        },
        isReadonly(): boolean {
            return this.expansionPanel.isReadonly;
        },
    },
    created() {
        this.expansionPanel.registerHeader(this);
    },
    beforeDestroy() {
        this.expansionPanel.unregisterHeader();
    },
    methods: {
        onClick(e: MouseEvent) {
            this.$emit("click", e);
        },
        genIcon() {
            const icon = getSlot(this, "actions") || [this.$createElement(VIcon, this.expandIcon)];

            return this.$createElement(VFadeTransition, [
                this.$createElement(
                    "div",
                    {
                        staticClass: "v-collapse-item-header__icon",
                        class: {
                            "v-collapse-item-header__icon--disable-rotate": this.disableIconRotate,
                        },
                        directives: [
                            {
                                name: "show",
                                value: !this.isDisabled,
                            },
                        ],
                    },
                    icon,
                ),
            ]);
        },
    },
    render(h): VNode {
        return h(
            "button",
            this.setBackgroundColor(this.color, {
                staticClass: "v-collapse-item-header",
                class: this.classes,
                attrs: {
                    tabindex: this.isDisabled ? -1 : null,
                    type: "button",
                    "aria-expanded": this.isActive,
                },
                directives: [
                    {
                        name: "ripple",
                        value: this.ripple,
                    },
                ],
                on: {
                    ...this.$listeners,
                    click: this.onClick,
                    mousedown: () => (this.hasMousedown = true),
                    mouseup: () => (this.hasMousedown = false),
                },
            }),
            [getSlot(this, "default", { open: this.isActive }, true), this.hideActions || this.genIcon()],
        );
    },
});
