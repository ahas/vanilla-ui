import { createSimpleFunctional } from '../../utils/helpers';
import OCard from './OCard';

const OCardActions = createSimpleFunctional("OCardActions", "o-card__actions");
const OCardSubtitle = createSimpleFunctional("OCardSubtitle", "o-card__subtitle");
const OCardText = createSimpleFunctional("OCardText", "o-card__text");
const OCardTitle = createSimpleFunctional("OCardTitle", "o-card__title");

export { OCard, OCardActions, OCardSubtitle, OCardText, OCardTitle };