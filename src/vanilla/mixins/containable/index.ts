import Vue from "vue";

import { convertToUnit } from "../../utils/helpers";

const availableSizes = ["x-small", "small", "medium", "large", "x-large"];

const classCache = new Map();

export default Vue.extend({
    props: {
        width: [Number, String],
        height: [Number, String],
        padding: [Number, String],
        margin: [Number, String],
        paddingTop: [Number, String],
        paddingRight: [Number, String],
        paddingBottom: [Number, String],
        paddingLeft: [Number, String],
        marginTop: [Number, String],
        marginRight: [Number, String],
        marginBottom: [Number, String],
        marginLeft: [Number, String],
    },
    computed: {
        containableClasses(): any[] {
            let cacheKey = "";
            for (const prop in this.$props) {
                cacheKey += String(this.$props[prop]);
            }
            let classList = classCache.get(cacheKey);

            if (!classList) {
                classList = [];
                const classes: Dictionary<any> = {
                    "fill-width": this.width == "fill" || this.width == "100%",
                    "fill-height": this.height == "fill" || this.height == "100%",
                };
                // Padding
                if (availableSizes.includes(this.padding as any)) {
                    classes["p-" + this.padding] = true;
                }
                if (availableSizes.includes(this.paddingTop as any)) {
                    classes["pt-" + this.paddingTop] = true;
                }
                if (availableSizes.includes(this.paddingRight as any)) {
                    classes["pr-" + this.paddingRight] = true;
                }
                if (availableSizes.includes(this.paddingBottom as any)) {
                    classes["pb-" + this.paddingBottom] = true;
                }
                if (availableSizes.includes(this.paddingLeft as any)) {
                    classes["pl-" + this.paddingLeft] = true;
                }
                // Margin
                if (availableSizes.includes(this.margin as any)) {
                    classes["m-" + this.margin] = true;
                }
                if (availableSizes.includes(this.marginTop as any)) {
                    classes["mt-" + this.marginTop] = true;
                }
                if (availableSizes.includes(this.marginRight as any)) {
                    classes["mr-" + this.marginRight] = true;
                }
                if (availableSizes.includes(this.marginBottom as any)) {
                    classes["mb-" + this.marginBottom] = true;
                }
                if (availableSizes.includes(this.marginLeft as any)) {
                    classes["ml-" + this.marginLeft] = true;
                }

                classList.push(classes);
                classCache.set(cacheKey, classList);
            }
            return classList;
        },
        containableStyles(): object {
            const styles: Dictionary<any> = {};
            if (this.width != "fill" && this.width != "100%") {
                styles.width = convertToUnit(this.width);
            }
            if (this.height != "fill" && this.height != "100%") {
                styles.height = convertToUnit(this.height);
            }
            // Padding
            if (this.padding && !availableSizes.includes(this.padding as any)) {
                styles.padding = convertToUnit(this.padding);
            }
            if (this.paddingTop && !availableSizes.includes(this.paddingTop as any)) {
                styles.paddingTop = convertToUnit(this.paddingTop);
            }
            if (this.paddingRight && !availableSizes.includes(this.paddingRight as any)) {
                styles.paddingRight = convertToUnit(this.paddingRight);
            }
            if (this.paddingBottom && !availableSizes.includes(this.paddingBottom as any)) {
                styles.paddingBottom = convertToUnit(this.paddingBottom);
            }
            if (this.paddingLeft && !availableSizes.includes(this.paddingLeft as any)) {
                styles.paddingLeft = convertToUnit(this.paddingLeft);
            }
            // Margin
            if (this.margin && !availableSizes.includes(this.margin as any)) {
                styles.margin = convertToUnit(this.margin);
            }
            if (this.marginTop && !availableSizes.includes(this.marginTop as any)) {
                styles.marginTop = convertToUnit(this.marginTop);
            }
            if (this.marginRight && !availableSizes.includes(this.marginRight as any)) {
                styles.marginRight = convertToUnit(this.marginRight);
            }
            if (this.marginBottom && !availableSizes.includes(this.marginBottom as any)) {
                styles.marginBottom = convertToUnit(this.marginBottom);
            }
            if (this.marginLeft && !availableSizes.includes(this.marginLeft as any)) {
                styles.marginLeft = convertToUnit(this.marginLeft);
            }
            return styles;
        },
    },
});
