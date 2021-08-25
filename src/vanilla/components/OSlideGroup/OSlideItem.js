// Extensions
import { OBaseItem } from "../OItemGroup/OItem";

// Mixins
import { factory as GroupableFactory } from "../../mixins/groupable";

export default Vue.extend({
    name: "OSlideItem",
    mixins: [OBaseItem, GroupableFactory("slideGroup")],
});
