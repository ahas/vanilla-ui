import Vue from "vue";
import { install } from "./install";

// Services
import * as services from "./services";

// Types
import { UserVanillaPreset, VanillaPreset } from "./types/services/presets";
import { VanillaService, VanillaServiceContract } from "./types/services";

export default class Vanilla {
    static install = install;
    static installed = false;
    static version = __VUETIFY_VERSION__;
    static config = {
        silent: false,
    };
    public framework: Dictionary<VanillaServiceContract> = {
        isHydrating: false,
    } as any;
    public installed: string[] = [];
    public preset = {} as VanillaPreset;
    public userPreset: UserVanillaPreset = {};

    constructor(userPreset: UserVanillaPreset = {}) {
        this.userPreset = userPreset;

        this.use(services.Goto);
        this.use(services.Presets);
        this.use(services.Breakpoint);
        this.use(services.Theme);
        this.use(services.Application);
    }
    init(root: Vue, ssrContext?: object): void {
        this.installed.forEach((property) => {
            const service = this.framework[property];
            service.framework = this.framework;
            service.init(root, ssrContext);
        });
        this.framework.rtl = Boolean(this.preset.rtl) as any;
    }
    use(Service: VanillaService): void {
        const property = Service.property;

        if (this.installed.includes(property)) {
            return;
        }

        this.framework[property] = new Service(this.preset, this as any);
        this.installed.push(property);
    }
}
