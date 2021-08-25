import { createSimpleFunctional } from "../../utils/helpers";

import OList from "./OList";
import OListGroup from "./OListGroup";
import OListItem from "./OListItem";
import OListItemGroup from "./OListItemGroup";
import OListItemAction from "./OListItemAction";
import OListItemAvatar from "./OListItemAvatar";
import OListItemIcon from "./OListItemIcon";

export const OListItemActionText = createSimpleFunctional("OListItemActionText", "o-list-item__action-text", "span");
export const OListItemContent = createSimpleFunctional("OListItemContent", "o-list-item__content");
export const OListItemTitle = createSimpleFunctional("OListItemTitle", "o-list-item__title");
export const OListItemSubtitle = createSimpleFunctional("OListItemSubtitle", "o-list-item__subtitle");

export { OList, OListGroup, OListItem, OListItemAction, OListItemAvatar, OListItemIcon, OListItemGroup };
