require("dotenv").config();

const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "dist"),
    devServer: {
        proxy: `https://localhost:${process.env.PORT}`
    }
};
