import Vue from "vue";

/* @vue/component */
export default Vue.extend({
    name: "filterable",

    props: {
        noDataText: {
            type: String,
            default: "$vanilla.noDataText",
        },
    },
});
