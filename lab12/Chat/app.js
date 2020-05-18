// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

// jako „bazy” używamy Express.js
const express = require("express");
const app = express();
app.set("view engine", "ejs");

// wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mechanizm sesji – z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongoose = require('mongoose');
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession);

// session store
const sessionStore = new MongoStore({ 
    mongooseConnection: mongoose.connection 
});

app.use(expressSession({
    secret: process.env.APP_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

const path = require("path");
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");

// inicjalizacja sesji
app.use(passport.initialize());
app.use(passport.session());

// drobiazgi do sprawnego i czytelnego logowania
const logger = require("morgan");
const errorHandler = require("errorhandler");

// middleware do kompilacji SCSS -> CSS
const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/views"),
    debug: false,
    outputStyle: "compressed",
}));

// główny „serwer statyczny”
app.use(express.static(path.join(__dirname, "views")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === process.env.NODE_ENV) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

// routing aplikacji
const routes = require("./routes");
app.use(routes);

// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.port;

// Model
const model = require("./model");
const ChatRoom = model.chatRoom;
const Message = model.message;

// Socket.io
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const io = socketio(server);

io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.APP_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

io.on('error', (err) => { 
    console.log("Socket.IO Error"); 
    console.log(err.stack);
});

io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);

    // socket.on("room", (roomName) => {
    //     if (socket.request.user && socket.request.user.logged_in) {
    //         socket.join("roomName");
    //         console.log("Room created");
    //     };
    // });

    socket.on("chatMessage", (data) => {
        // user data from the socket.io passport middleware
        if (socket.request.user && socket.request.user.logged_in) {
            let modifiedData = {
                handle: socket.request.user.username,
                content: data.content
            };
            
            message = new Message({
                handle: socket.request.user.username,
                content: data.content
            });
            
            ChatRoom.findOneAndUpdate(
                { name: data.roomName },
                { $push: { messages: message } },
                () => {}
            );

            io.sockets.emit("chatMessage", modifiedData);
        };
    });
});

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});

