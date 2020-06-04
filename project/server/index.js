require("dotenv").config();

const express = require("express");

const app = express();

// Wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cors = require("cors");
app.use(cors({ credentials: true }));

// Sesja z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Session store
const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection
});

app.use(session({
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

// app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// Routing
const routes = require("./routes");
app.use("/api", routes);

const auctionRoutes = require("./routes/auction");
app.use("/api", auctionRoutes);

const coversationRoutes = require("./routes/conversation");
app.use("/api", coversationRoutes);

// Wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.PORT;

// Socket.io
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const io = socketio(server);

const model = require("./model");
const Auction = model.Auction;
const Conversation = model.Conversation;
const Message = model.Message;

io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.APP_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

// let bidsInProgress = [];

io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    const username = socket.request.user.username;

    // Auctions
    socket.on("join-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.log(`Socket: User ${username} is joining { ${data.id} }`);
            socket.join(data.id);
        }
    });
    socket.on("start-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.log(`New auction socket created, id: { ${data.id} }`);
        }
    });
    socket.on("leave-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.log(`Socket: User ${username} is leaving { ${data.id} }`);
            socket.leave(data.socketId);// probably data.id?
        }
    });

    socket.on("new-bid", async (data) => {
        if (socket.request.user.logged_in) {
            // if (!bidsInProgress.includes())
            // wrzucić całe to do osobnej funkcji odpalanej na końcu
            const filter = data.id;
            let oldBidders;
            try {
                const doc = await Auction.findById(filter);
                oldBidders = doc.bidders;
            } catch (err) {
                console.log(err);
                return io.sockets.in(data.id).emit("server-error");// todo wyswietlanie bledu
            }
            const update = {
                price: data.price,
                highestBidder: data.highestBidder
            };

            const newBidders = [data.highestBidder];
            if (!oldBidders.includes(newBidders[0])) {
                oldBidders.push(newBidders[0]);
                const updatedBidders = oldBidders;
                update.bidders = updatedBidders;
            };

            Auction.findByIdAndUpdate(filter, update,
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        io.sockets.in(data.id).emit("server-error");
                    } else {
                        io.sockets.in(data.id).emit("new-bid", update);
                        console.log(`Socket: New bid from user: ${update.highestBidder}`);
                        console.log("Bid successfully posted!");
                    }
                }
            );
        }
    });

    // Conversations
    socket.on("join-conversation", (data) => {
        if (socket.request.user.logged_in) {
            console.log(`Socket: User ${username} is joining { ${data.id} }`);
            socket.join(data.id);
        }
    });
    socket.on("leave-conversation", (data) => {
        if (socket.request.user.logged_in) {
            console.log(`Socket: User ${username} is leaving { ${data.id} }`);
            socket.leave(data.id);
        }
    });

    socket.on("new-message", (data) => {
        if (socket.request.user.logged_in) {
            const message = new Message({
                handle: data.handle,
                content: data.content
            });

            Conversation.findByIdAndUpdate(
                { _id: data.id },
                { $push: { messages: message } },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        io.sockets.in(data.id).emit("server-error");
                    } else {
                        console.log(data);
                        io.sockets.in(data.id).emit("new-message", data);
                        console.log(`Socket: New message from user: ${data.handle}`);
                        console.log("Message successfully posted!");
                    }
                }
            );
        };
    });
});

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});
