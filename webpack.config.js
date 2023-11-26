const path = require("path");
const webpack = require("webpack");
module.exports = {
    module: {
        rules: [
            {
                test: /\.geojson$/,
                type: 'json',
            }
        ],
    },
    mode: "development",
    entry: {
        index: path.join(__dirname, "src/index.js"),
        helper: path.join(__dirname, "src/helper.js"),
        drawer: path.join(__dirname, "src/drawer.js"),
        
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
};
