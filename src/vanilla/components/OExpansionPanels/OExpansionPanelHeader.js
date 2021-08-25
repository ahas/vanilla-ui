import Vue from "vue";

// Components
import { OFadeTransition } from "../transitions";
import OIcon from "../OIcon/OIcon";

// Mixins
import Colorable from "../../mixins/colorable";
import { inject as RegistrableInject } from "../../mixins/registrable";

// Directives
import ripple from "../../directives/ripple";

// Utils
import { getSlot } from "../../utils/helpers";

export default Vue.extend({
    name: "o-expansion-panel-header",
    mixins: [Colorable, RegistrableInject("expansionPanel", "OExpansionPanelHeader", "OExpansionPanel")],
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
        classes() {
            return {
                "o-expansion-panel-header--active": this.isActive,
                "o-expansion-panel-header--mousedown": this.hasMousedown,
            };
        },
        isActive() {
            return this.expansionPanel.isActive;
        },
        isDisabled() {
            return this.expansionPanel.isDisabled;
        },
        isReadonly() {
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
        onClick(e) {
            this.$emit("click", e);
        },
        genIcon() {
            const icon = getSlot(this, "actions") || [this.$createElement(OIcon, this.expandIcon)];

            return this.$createElement(OFadeTransition, [
                this.$createElement(
                    "div",
                    {
                        staticClass: "o-expansion-panel-header__icon",
                        class: {
                            "o-expansion-panel-header__icon--disable-rotate": this.disableIconRotate,
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
    render(h) {
        return h(
            "button",
            this.setBackgroundColor(this.color, {
                staticClass: "o-expansion-panel-header",
                class: this.classes,
                attrs: {
                    tabindex: this.isDisabled ? -1 : null,
                    type: "button",
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
