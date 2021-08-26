import { createSimpleFunctional } from "../../utils/helpers";
import VCard from "./VCard";

const VCardActions = createSimpleFunctional("VCardActions", "v-card__actions");
const VCardSubtitle = createSimpleFunctional("VCardSubtitle", "v-card__subtitle");
const VCardText = createSimpleFunctional("VCardText", "v-card__text");
const VCardTitle = createSimpleFunctional("VCardTitle", "v-card__title");

export { VCard, VCardActions, VCardSubtitle, VCardText, VCardTitle };
