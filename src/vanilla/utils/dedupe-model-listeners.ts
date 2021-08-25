import { VNodeData } from "vue";

export default function dedupeModelListeners(data: VNodeData): void {
    if (data.model && data.on && data.on.input) {
        if (Array.isArray(data.on.input)) {
            const i = data.on.input.indexOf(data.model.callback);
            if (i > -1) data.on.input.splice(i, 1);
        } else {
            delete data.on.input;
        }
    }
}
