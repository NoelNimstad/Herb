const path = require("path");

module.exports =
{
    mode: "production",
    entry: "./build/herb.js",
    output:
    {
        path: path.resolve(__dirname, "build/"),
        filename: "herb.bundle.js",
        libraryTarget: "umd",
        globalObject: "this",
    },
    resolve:
    {
        extensions: [".js"],
    },
};