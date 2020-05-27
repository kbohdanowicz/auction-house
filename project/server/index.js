require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Sesja z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongoose = require("mongoose");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

// Session store
const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});

app.use(expressSession({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Inicjalizacja sesji
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Poziom Logowania
const logger = require("morgan");
const errorHandler = require("error-handler");
if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

// Publiczny folder
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// Routing
const routes = require("./routes");
app.use(routes);

// Wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.PORT;

// Model
const model = require("./model");
const ChatRoom = model.chatRoom;
const Message = model.message;

// Socket.io

// const socketio = require("socket.io");
// const passportSocketIo = require("passport.socketio");
// const io = socketio(server);

// io.use(passportSocketIo.authorize({
//     key: "connect.sid",
//     secret: process.env.APP_SECRET,
//     store: sessionStore,
//     passport: passport,
//     cookieParser: cookieParser
// }));

// io.on("error", (err) => {
//     console.log("Socket.IO Error");
//     console.log(err.stack);
// });

// io.on("connection", (socket) => {
//     console.log(`Made socket connection: ${socket.id}`);
//     socket.on("chatMessage", (data) => {
//         // User data from the socket.io passport middleware
//         if (socket.request.user && socket.request.user.logged_in) {
//             const modifiedData = {
//                 handle: socket.request.user.username,
//                 content: data.content
//             };

//             const message = new Message({
//                 handle: socket.request.user.username,
//                 content: data.content
//             });

//             ChatRoom.findOneAndUpdate(
//                 { name: data.roomName },
//                 { $push: { messages: message } },
//                 () => {}
//             );

//             io.sockets.emit("chatMessage", modifiedData);
//         };
//     });
// });

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});
