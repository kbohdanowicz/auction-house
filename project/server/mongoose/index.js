const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect(process.env.DBURI, {
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
