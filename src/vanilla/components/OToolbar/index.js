// Components
import OToolbar from "./OToolbar";

// Utils
import { createSimpleFunctional } from "../../utils/helpers";

const OToolbarTitle = createSimpleFunctional("OToolbarTitle", "o-toolbar__title");
const OToolbarItems = createSimpleFunctional("OToolbarItems", "o-toolbar__items");

export { OToolbar, OToolbarItems, OToolbarTitle };
