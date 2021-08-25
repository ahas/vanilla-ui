import Vue from "vue";

import OTextarea from "../OTextarea/OTextarea";
import OBtn from "../OBtn/OBtn";
import OIcon from "../OIcon/OIcon";
import { OSpacer, ORow, OCol } from "../OGrid";

export default Vue.extend({
    name: "OCommentForm",
    methods: {
        genButton() {
            return this.$createElement(
                OBtn,
                {
                    staticClass: "o-comment-form__btn",
                },
                [
                    this.$createElement(
                        OIcon,
                        {
                            props: { left: true },
                        },
                        "mdi-pencil",
                    ),
                    this.$t("$vanilla.comment.write"),
                ],
            );
        },
    },
    render(h) {
        return h(
            "div",
            {
                staticClass: "o-comment-form",
            },
            [
                this.$createElement(OTextarea, {
                    staticClass: "o-comment-form__input",
                }),
                [
                    this.$createElement(ORow, [
                        //
                        this.$createElement(OSpacer),
                        this.$createElement(OCol, { props: { cols: "auto" } }, [this.genButton()]),
                    ]),
                ],
            ],
        );
    },
});
