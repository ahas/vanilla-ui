import { createSimpleFunctional } from "../../utils/helpers";
import OSteps from "./OSteps";
import OStep from "./OStep";
import OStepContent from "./OStepContent";

const OStepsHeader = createSimpleFunctional("OStepsHeader", "o-steps__header");
const OStepsItems = createSimpleFunctional("OStepsItems", "o-steps__items");

export { OSteps, OStepContent, OStep, OStepsHeader, OStepsItems };
