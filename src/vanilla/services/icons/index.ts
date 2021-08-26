// Extensions
import { Service } from "../service";

// Utilities
import { mergeDeep } from "../../utils/helpers";

// Types
import { VanillaPreset } from "../../types/services/presets";
import { Icons as IIcons } from "../../types/services/icons";

// Presets
import presets from "./presets";

export class Icons extends Service implements IIcons {
    static property: "icons" = "icons";

    public iconfont: IIcons["iconfont"];

    public values: IIcons["values"];

    public component: IIcons["component"];

    constructor(preset: VanillaPreset) {
        super();

        const { iconfont, values, component } = preset[Icons.property];

        this.component = component;
        this.iconfont = iconfont;
        this.values = mergeDeep(presets[iconfont], values) as IIcons["values"];
    }
}
