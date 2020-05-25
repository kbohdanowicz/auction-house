require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Logging
const logger = require("morgan");
const errorHandler = require("error-handler");
if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

// Routing
const routes = require("./routes");
app.use(routes);

app.use((_, res) => {
    res.sendStatus(404);
});

// Model
const model = require("./model");
const ChatRoom = model.chatRoom;
const Message = model.message;

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
