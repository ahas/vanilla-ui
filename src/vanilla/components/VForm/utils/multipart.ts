const isUndefined = (value: any) => value === undefined;
const isNull = (value: any) => value === null;
const isBoolean = (value: any) => typeof value === "boolean";
const isNumber = (value: any) => typeof value === "number";
const isString = (value: any) => typeof value === "string";
const isObject = (value: any) => value === Object(value);
const isArray = (value: any) => Array.isArray(value);
const isDate = (value: any) => value instanceof Date;
const isBlob = (value: any) => value && typeof value.size === "number" && typeof value.type === "string" && typeof value.slice === "function";
const isFile = (value: any) =>
    isBlob(value) && typeof value.name === "string" && (typeof value.lastModifiedDate === "object" || typeof value.lastModified === "number");
const isFileArray = (value: any) => Array.isArray(value) && !value.find((x) => !isFile(x));

export interface MultipartOptions {
    indices: boolean;
}

const multipart = (obj: any, options?: MultipartOptions, formData?: FormData, lastKey?: string) => {
    options = options || ({} as any);
    options!.indices = isUndefined(options!.indices) ? true : options!.indices;
    formData = formData || new FormData();

    if (isUndefined(obj)) {
        return formData;
    } else if (isNull(obj)) {
        formData.append(lastKey!, "null;");
    } else if (isBoolean(obj)) {
        formData.append(lastKey!, obj ? "boolean;true" : "boolean;false");
    } else if (isNumber(obj)) {
        formData.append(lastKey!, "number;" + obj);
    } else if (isString(obj)) {
        formData.append(lastKey!, "string;" + obj);
    } else if (isFileArray(obj)) {
        for (const file of obj) {
            formData.append(lastKey!, file);
        }
    } else if (isArray(obj)) {
        if (obj.length) {
            (obj as any[]).forEach((value, index) => {
                const key = lastKey + "[" + (options!.indices ? index : "") + "]";
                multipart(value, options, formData, key);
            });
        } else {
            formData.append(lastKey!, "array;empty");
        }
    } else if (isDate(obj)) {
        formData.append(lastKey!, "date;" + obj.toISOString());
    } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
        Object.keys(obj).forEach((prop) => {
            const value = obj[prop];
            if (isArray(value)) {
                while (prop.length > 2 && prop.lastIndexOf("[]") === prop.length - 2) {
                    prop = prop.substring(0, prop.length - 2);
                }
            }
            const key = lastKey ? lastKey + "[" + prop + "]" : prop;
            multipart(value, options, formData, key);
        });
    } else {
        formData.append(lastKey!, obj);
    }

    return formData;
};

export default multipart;
