require("dotenv").config();

module.exports = {
    devServer: {
        proxy: `https://localhost:${process.env.PORT}`
    }
};
