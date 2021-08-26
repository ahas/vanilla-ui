// Styles
import "./OBtnGroup.scss";

// Mixins
import ButtonGroup from "../../mixins/button-group";
import Colorable from "../../mixins/colorable";

// Utilities
import mixins from "../../utils/mixins";

/* @vue/component */
export default mixins(ButtonGroup, Colorable).extend({
    name: "OBtnGroup",
    props: {
        backgroundColor: String,
        borderless: Boolean,
        group: Boolean,
        square: Boolean,
        rounded: Boolean,
        shaped: Boolean,
        dashed: Boolean,
        tile: Boolean,
        stick: Boolean,
    },
    computed: {
        classes() {
            return {
                ...ButtonGroup.options.computed.classes.call(this),
                "v-btn-group": true,
                "v-btn-group--borderless": this.borderless,
                "v-btn-group--group": this.group,
                "v-btn-group--square": this.square,
                "v-btn-group--rounded": this.rounded,
                "v-btn-group--shaped": this.shaped,
                "v-btn-group--tile": this.tile,
                "v-btn-group--stick": this.stick,
                "v-btn-group--dashed": this.dashed,
                ...this.themeClasses,
            };
        },
    },
    methods: {
        genData() {
            const data = this.setTextColor(this.color, {
                ...ButtonGroup.options.methods.genData.call(this),
            });

            if (this.group) {
                return data;
            }

            return this.setBackgroundColor(this.backgroundColor, data);
        },
    },
});
