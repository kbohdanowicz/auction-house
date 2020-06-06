const mongoose = require("mongoose");

const remoteConnectionString = "mongodb://admin:whIsky7fOx6Haend4Malaka@ds121965.mlab.com:21965/heroku_kf3b52k4";
// const localConnectionString = process.env.DBURI;

(async () => {
    try {
        await mongoose.connect(remoteConnectionString, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

const db = mongoose.connection;

db.on("open", () => {
    console.log("Connected to MongoDB!");
});

db.on("error", console.error.bind(console, "MongoDb connection error: "));

module.exports = mongoose;
