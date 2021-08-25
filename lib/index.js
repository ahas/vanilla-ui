const { resolve } = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = function () {
    this.options.css.push("@mdi/font/css/materialdesignicons.min.css");
    this.options.css.push(resolve(__dirname, isProd ? "../dist/olive.min.css" : "../dist/olive.scss"));
    this.options.plugins.push(resolve(__dirname, "olive.js"));
};
module.exports.meta = require("../package.json");
