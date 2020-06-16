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

// app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// Routing
const routes = require("./routes");
app.use("/api", routes);

const auctionRoutes = require("./routes/auction");
app.use("/api", auctionRoutes);

const coversationRoutes = require("./routes/conversation");
app.use("/api", coversationRoutes);

const path = require("path");

// Handle production
app.use(express.static(path.join(__dirname, "../dist")));

app.get(/.*/, (req, res) => res.sendFile(__dirname, "/public/index.html"));

// Wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.PORT || 3000;

// Socket.io
const socketio = require("socket.io");
const passportSocketIo = require("passport.socketio");
const io = socketio(server);

const model = require("./model");
const Auction = model.Auction;
const Conversation = model.Conversation;
const Message = model.Message;
const User = model.User;

io.use(passportSocketIo.authorize({
    key: "connect.sid",
    secret: process.env.APP_SECRET,
    store: sessionStore,
    passport: passport,
    cookieParser: cookieParser
}));

let isTransactionInProgress = false;

io.on("connection", (socket) => {
    console.log(`Made socket connection: ${socket.id}`);
    const username = socket.request.user.username;

    // Notifications
    socket.on("join-user-room", (data) => {
        console.dir(`[Socket]: User: "${username}" has JOINED self { ${data.id} }`);
        socket.join(data.id);
    });

    socket.on("leave-user-room", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has LEFT self { ${data.id} }`);
            socket.leave(data.id);
        }
    });

    socket.on("join-auction", (data) => {
        console.dir(`[Socket]: User: "${username}" has JOINED { ${data.id} }`);
        socket.join(data.id);
    });

    socket.on("leave-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has LEFT { ${data.id} }`);
            socket.leave(data.id);
        }
    });

    // Auctions
    socket.on("join-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has JOINED { ${data.id} }`);
            socket.join(data.id);
        }
    });
    socket.on("start-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: New auction socket created, id: { ${data.id} }`);
        }
    });
    socket.on("leave-auction", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has LEFT { ${data.id} }`);
            socket.leave(data.id);
        }
    });
    socket.on("new-bid", async (data) => {
        if (socket.request.user.logged_in && !isTransactionInProgress) {
            // Initialize transaction
            isTransactionInProgress = true;
            const filter = data.id;
            let oldBidders;
            let oldPrice;
            let oldHighestBidder;
            try {
                const doc = await Auction.findById(filter);
                oldBidders = doc.bidders;
                oldPrice = doc.price;
                oldHighestBidder = doc.highestBidder;
            } catch (err) {
                console.log(err);
            }
            if (data.price > oldPrice) {
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
                const tempUpdate = {
                    price: data.price,
                    highestBidder: data.highestBidder
                };
                Auction.findByIdAndUpdate(filter, update,
                    (err, doc) => {
                        if (err) {
                            console.log(err);
                            io.sockets.in(data.id).emit("server-error");
                        } else {
                            io.sockets.in(data.id).emit("new-bid", tempUpdate);
                            console.dir(`[Socket]: New bid from user: ${update.highestBidder}`);
                            io.sockets.in(oldHighestBidder).emit(
                                "bid-lost", {
                                    auctionName: doc.name,
                                    newHighestBidder: update.highestBidder,
                                    oldHighestBidder: oldHighestBidder
                                }
                            );
                            // push notifications to user
                            const filter = {
                                username: oldHighestBidder
                            };
                            User.findOneAndUpdate(
                                filter,
                                {
                                    $push: { notifications: `Someone bid higher for ${doc.name}` },
                                    isNewNotification: true
                                },
                                (err, doc) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.dir("Notification pushed");
                                    }
                                }
                            );
                        }
                    }
                );
            }
            // Commit transaction
            isTransactionInProgress = false;
        } else {
            io.sockets.in(data.id).emit("server-busy");
        }
    });
    socket.on("new-buy", async (data) => {
        if (socket.request.user.logged_in && !isTransactionInProgress) {
            // Initialize transaction
            isTransactionInProgress = true;
            const filter = data.id;
            const update = {
                status: data.status,
                highestBidder: data.highestBidder
            };

            Auction.findByIdAndUpdate(filter, update,
                (err) => {
                    if (err) {
                        console.log(err);
                        io.sockets.in(data.id).emit("server-error");
                    } else {
                        io.sockets.in(data.id).emit("new-buy", update);
                        console.dir(`[Socket]: Product bought by user: ${update.highestBidder}`);
                    }
                }
            );
        } else {
            io.sockets.in(data.id).emit("server-busy");
        }
        // Commit transaction
        isTransactionInProgress = false;
    });

    // Conversations
    socket.on("join-conversation", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has JOINED auction { ${data.id} }`);
            socket.join(data.id);
        }
    });
    socket.on("leave-conversation", (data) => {
        if (socket.request.user.logged_in) {
            console.dir(`[Socket]: User: "${username}" has LEFT auction { ${data.id} }`);
            socket.leave(data.id);
        }
    });
    socket.on("update-conversation-seen", async (data) => {
        if (socket.request.user.logged_in) {
            const doc = await Conversation.findById(data.id);
            for (const msg of doc.messages.reverse()) {
                if (!msg.seen.includes(username)) {
                    msg.seen.push(username);
                } else {
                    break;
                }
            }
            Conversation.update(
                { _id: data.id }, doc,
                (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`[Socket]: Messages read by user: ${username}`);
                    }
                }
            );
        }
    });
    socket.on("new-message", (data) => {
        if (socket.request.user.logged_in) {
            const usersInConversation = io.sockets.adapter.rooms[data.id].length;
            console.dir(`${usersInConversation} users in conversation`);
            let message;
            if (usersInConversation > 1) {
                message = new Message({
                    handle: data.handle,
                    content: data.content,
                    seen: [username, data.otherUser]
                });
            } else {
                message = new Message({
                    handle: data.handle,
                    content: data.content,
                    seen: [username]
                });
            }
            Conversation.findByIdAndUpdate(
                data.id,
                { $push: { messages: message } },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.in(data.id).emit("new-message", data);
                        console.dir(`[Socket]: New message from user: ${data.handle}`);
                    }
                }
            );
        };
    });
});

const filter = {
    type: "Bid"
};
Auction.find(filter, (err, docs) => {
    if (err) {
        console.dir(err);
    } else {
        docs.forEach(doc => {
            if (doc.status === "OnSale") {
                if (doc.endTime >= new Date().getTime()) {
                    // console.dir("Timeout started");
                    setTimeout(() => {
                        Auction.findOne(filter, (err, doc) => {
                            if (err) {
                                console.dir(err);
                            } else if (doc.highestBidder !== "") {
                                console.dir("Auction sold");
                                doc.status = "Sold";
                            } else {
                                console.dir("Auction ignored");
                                doc.status = "Ignored";
                            }
                            doc.save();
                        }
                        );
                    }, doc.duration);
                } else {
                    console.dir(`Auction { name: ${doc.name} } is aborted`);
                    doc.status = "Ignored";
                    doc.save();
                }
            }
        });
    }
});

server.listen(port, () => {
    console.log(`https://localhost:${port}`);
});
