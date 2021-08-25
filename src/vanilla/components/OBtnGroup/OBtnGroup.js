import Vue from "vue";

// Styles
import "./OBtnGroup.scss";

// Mixins
import ButtonGroup from "../../mixins/button-group";
import Colorable from "../../mixins/colorable";

/* @vue/component */
export default Vue.extend({
    name: "OBtnGroup",
    mixins: [ButtonGroup, Colorable],
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
                "o-btn-group": true,
                "o-btn-group--borderless": this.borderless,
                "o-btn-group--group": this.group,
                "o-btn-group--square": this.square,
                "o-btn-group--rounded": this.rounded,
                "o-btn-group--shaped": this.shaped,
                "o-btn-group--tile": this.tile,
                "o-btn-group--stick": this.stick,
                "o-btn-group--dashed": this.dashed,
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
