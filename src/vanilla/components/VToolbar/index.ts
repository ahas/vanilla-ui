// Components
import VToolbar from "./VToolbar";

// Utils
import { createSimpleFunctional } from "../../utils/helpers";

const VToolbarTitle = createSimpleFunctional("VToolbarTitle", "v-toolbar__title");
const VToolbarItems = createSimpleFunctional("VToolbarItems", "v-toolbar__items");

export { VToolbar, VToolbarItems, VToolbarTitle };
