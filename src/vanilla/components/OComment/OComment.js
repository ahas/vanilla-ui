import Vue from "vue";

import { provide as RegistrableProvide, inject as RegistrableInject } from "../../mixins/registrable";

// Mixins
import Themeable from "../../mixins/themeable";

// Components
import { ORow, OCol } from "../OGrid";
import OAvatar from "../OAvatar/OAvatar";
import OIcon from "../OIcon/OIcon";
import OImg from "../OImg/OImg";

export default Vue.extend({
    name: "OComment",
    mixins: [RegistrableProvide("comment", true), RegistrableInject("comment"), Themeable],
    props: {
        avatar: String,
        author: String,
        text: String,
        actions: Array,
    },
    computed: {
        classes() {
            return {
                "o-comment": true,
            };
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-comment",
            },
            [
                this.$createElement(ORow, [
                    this.$createElement(
                        OCol,
                        {
                            props: {
                                cols: "auto",
                            },
                        },
                        [
                            this.$slots.avatar ||
                                this.$createElement(
                                    OAvatar,
                                    {
                                        props: {
                                            color: "grey",
                                        },
                                    },
                                    [
                                        this.avatar
                                            ? this.$createElement(OImg, { src: this.avatar })
                                            : this.$createElement(OIcon, { props: { dark: true } }, "mdi-account"),
                                    ],
                                ),
                        ],
                    ),
                    this.$createElement(OCol, [
                        this.$createElement(
                            "div",
                            {
                                staticClass: "o-comment__content",
                            },
                            [
                                this.$createElement(
                                    "div",
                                    {
                                        staticClass: "o-comment__author",
                                    },
                                    this.author,
                                ),
                                this.$createElement(
                                    "div",
                                    {
                                        staticClass: "o-comment__text",
                                    },
                                    this.text,
                                ),
                            ],
                        ),
                    ]),
                ]),
            ],
        );
    },
});
