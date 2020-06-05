require("dotenv").config();

const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "./server/public"),
    devServer: {
        proxy: `https://localhost:${process.env.PORT}`
    }
};
