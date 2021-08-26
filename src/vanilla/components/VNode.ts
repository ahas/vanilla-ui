import { CreateElement, RenderContext } from "vue/types";

export default {
    functional: true,
    render: (h: CreateElement, ctx: RenderContext) => ctx.props.value,
};
