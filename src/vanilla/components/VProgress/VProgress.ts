import Vue from "vue";

import VProgressBar from "./VProgressBar";
import VProgressCircle from "./VProgressCircle";

export default Vue.extend({
    name: "v-progress",
    functional: true,
    props: {
        type: { type: String, validate: (v: string) => v == "circle" || "bar", default: "bar" },
    },
    render(h, { data, props }) {
        if (props.type == "bar") {
            return h(VProgressBar, { ...data });
        }
        return h(VProgressCircle, { ...data });
    },
});
