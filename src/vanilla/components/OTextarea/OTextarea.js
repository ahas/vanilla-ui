// Styles
import './OTextarea.scss';

import Vue from 'vue';

// Extensions
import OTextField from '../OTextField/OTextField';

/* @vue/component */
export default Vue.extend({
    name: "OTextarea",
    mixins: [OTextField],
    props: {
        autoGrow: Boolean,
        noResize: Boolean,
        rowHeight: {
            type: [Number, String],
            default: 24,
            validator: (v) => !isNaN(parseFloat(v)),
        },
        rows: {
            type: [Number, String],
            default: 5,
            validator: (v) => !isNaN(parseInt(v, 10)),
        },
    },
    computed: {
        classes() {
            return {
                "o-textarea": true,
                "o-textarea--auto-grow": this.autoGrow,
                "o-textarea--no-resize": this.noResizeHandle,
                ...OTextField.options.computed.classes.call(this),
            };
        },
        noResizeHandle() {
            return this.noResize || this.autoGrow;
        },
    },
    watch: {
        lazyValue() {
            this.autoGrow && this.$nextTick(this.calculateInputHeight);
        },
        rowHeight() {
            this.autoGrow && this.$nextTick(this.calculateInputHeight);
        },
    },
    mounted() {
        setTimeout(() => {
            this.autoGrow && this.calculateInputHeight();
        }, 0);
    },
    methods: {
        calculateInputHeight() {
            const input = this.$refs.input;
            if (!input) return;

            input.style.height = "0";
            const height = input.scrollHeight;
            const minHeight = parseInt(this.rows, 10) * parseFloat(this.rowHeight);
            // This has to be done ASAP, waiting for Vue
            // to update the DOM causes ugly layout jumping
            input.style.height = Math.max(minHeight, height) + "px";
        },
        genInput() {
            const input = OTextField.options.methods.genInput.call(this);

            input.tag = "textarea";
            delete input.data.attrs.type;
            input.data.attrs.rows = this.rows;

            return input;
        },
        onInput(e) {
            OTextField.options.methods.onInput.call(this, e);
            this.autoGrow && this.calculateInputHeight();
        },
        onKeyDown(e) {
            // Prevents closing of a
            // dialog when pressing
            // enter
            if (this.isFocused && e.keyCode === 13) {
                e.stopPropagation();
            }

            this.$emit("keydown", e);
        },
    },
});
