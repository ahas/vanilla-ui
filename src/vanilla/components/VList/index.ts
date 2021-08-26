import { createSimpleFunctional } from "../../utils/helpers";

import VList from "./VList";
import VListGroup from "./VListGroup";
import VListItem from "./VListItem";
import VListItemGroup from "./VListItemGroup";
import VListItemAction from "./VListItemAction";
import VListItemAvatar from "./VListItemAvatar";
import VListItemIcon from "./VListItemIcon";

export const VListItemActionText = createSimpleFunctional("VListItemActionText", "v-list-item__action-text", "span");
export const VListItemContent = createSimpleFunctional("VListItemContent", "v-list-item__content");
export const VListItemTitle = createSimpleFunctional("VListItemTitle", "v-list-item__title");
export const VListItemSubtitle = createSimpleFunctional("VListItemSubtitle", "v-list-item__subtitle");

export { VList, VListGroup, VListItem, VListItemAction, VListItemAvatar, VListItemIcon, VListItemGroup };
