import Vue from "vue";

import "./OComments.scss";

// Mixins
import { provide as RegistrableProvide, inject as RegistrableInject } from "../../mixins/registrable";

export default Vue.extend({
    name: "OComments",
    mixins: [RegistrableProvide("comments")],
    props: {
        url: String,
        items: Array,
        author: String,
        text: String,
        actions: Array,
        hideAvatar: Boolean,
    },
    methods: {
        genWrapper() {
            return this.$createElement(
                "div",
                {
                    staticClass: "o-comment__wrapper",
                },
                [this.$slots.default],
            );
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-comments",
            },
            [this.genWrapper()],
        );
    },
});
