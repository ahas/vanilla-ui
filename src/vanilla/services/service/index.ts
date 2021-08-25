// Contracts
import { VanillaServiceContract } from "../../types/services";

// Types
import Vue from "vue";

export class Service implements VanillaServiceContract {
    framework = {};

    init(root: Vue, ssrContext?: object) {}
}
