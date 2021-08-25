const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const isExtractCss = isProd || process.env.TARGET === "development";

const cssLoaders = [
    isExtractCss ? MiniCssExtractPlugin.loader : "style-loader",
    { loader: "css-loader", options: { sourceMap: !isProd } },
    { loader: "postcss-loader", options: { sourceMap: !isProd } },
];

const sassLoaders = [
    ...cssLoaders,
    {
        loader: "sass-loader",
        options: {
            implementation: require("sass"),
            sassOptions: {
                indentedSyntax: true,
            },
        },
    },
];

const scssLoaders = [
    ...cssLoaders,
    {
        loader: "sass-loader",
        options: {
            implementation: require("sass"),
            sassOptions: {
                indentedSyntax: false,
            },
        },
    },
];

module.exports = {
    mode: isProd ? "production" : "development",
    entry: "./src/index.js",
    optimization: {
        minimize: isProd,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "olive.js",
        libraryTarget: "umd",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isProd ? "olive.min.css" : "olive.css",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: sassLoaders,
            },
            {
                test: /\.scss$/,
                use: scssLoaders,
            },
            {
                test: /\.m?js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { modules: false }]],
                    },
                },
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "eslint-loader",
                },
            },
        ],
    },
};
