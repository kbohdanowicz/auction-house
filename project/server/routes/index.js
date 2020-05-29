const express = require("express");
const router = express.Router();

const model = require("../model");
const User = model.User;
const Auction = model.Auction;
// eslint-disable-next-line no-unused-vars
const ChatRoom = model.ChatRoom;

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

// Uwierzytelnianie
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({
        message: "Not authenticated"
    });
};

router
    .route("/users")
    .get(passport.authenticate("basic", {
        session: false
    }), (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                res.status(500).send();
            } else {
                res.json(data);
            }
        });
    })
    .all(rejectMethod);

router
    .route("/current-user")
    .get(isLoggedIn, (req, res) => {
        if (req.user) {
            res.send({
                currentUser: req.user,
                isLoggedIn: req.isAuthenticated()
            });
        } else {
            res.status(403).send({
                success: false,
                msg: "Unauthorized."
            });
        }
    });

router
    .route("/login")
    .post(passport.authenticate("local"), async (req, res) => {
        await res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        console.log("Logging out");
        req.logout();
        res.status(200).send({
            isAuthenticated: req.isAuthenticated()
        });
    })
    .all(rejectMethod);

router
    .route("/register")
    .post(async (req, res) => {
        try {
            const passwordHash = bcrypt.hash(req.body.password);
            const user = new User({
                username: req.body.username,
                password: passwordHash
            });
            const doc = await user.save();
            res.json(doc);
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.status(422).json(model.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

router.route("/auction/id=:id")
    .get((req, res) => { // isLoggedIn,
        Auction.findOne({ _id: req.params.id }, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                res.json(doc);
            }
        });
    })
    .patch((req, res) => { // isLoggedIn,
        const filter = req.params.id;
        const update = {};
        let oldBidders;
        Auction.findById(filter, (err, data) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                oldBidders = data.bidders;
            }
        });

        // this or maybe a put method?
        // patch is needed to update: price, duration, and status
        const body = req.body;
        if (body.name) {
            update.name = body.name;
        }
        if (body.price) {
            update.price = body.price;
        }
        if (body.type) {
            update.type = body.type;
        }
        if (body.status) {
            update.status = body.status;
        }
        if (body.duration) {
            update.duration = body.duration;
        }

        if (body.bidders) {
            const newBidders = body.bidders;
            if (!oldBidders.includes(newBidders[0])) {
                const updatedBidders = oldBidders.push(newBidders[0]);
                update.bidders = updatedBidders;
            };
        };

        console.log("Update:" + update);
        Auction.findByIdAndUpdate(filter, update,
            (err, doc) => {
                if (err) {
                    res.code(500);
                } else {
                    res.json(doc);
                }
            }
        );
    })
    .all(rejectMethod);

router.route("/auction")
    .post(async (req, res) => {
        try {
            const user = req.user;
            const body = req.body;
            let auction = {};
            // TODO try auction.timeLeft = body.timeLeft;
            if (req.body.type === "Bid") {
                auction = new Auction({
                    name: body.name,
                    price: body.price,
                    type: body.type,
                    seller: user.username,
                    bidders: [],
                    duration: body.duration,
                    status: body.status
                });
            } else {
                auction = new Auction({
                    name: body.name,
                    price: body.price,
                    type: body.type,
                    seller: user.username,
                    status: body.status
                });
            }
            const doc = await auction.save();
            res.json(doc);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router
    .route("/auctions")
    .get(async (req, res) => {
        try {
            const docs = [];
            for await (const doc of Auction.find()) {
                docs.push(doc);
            }
            // docs = await Auction.find();
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router.route("/my-auctions")
    .get(async (req, res) => {
        try {
            const docs = await Auction.find({
                bidders: req.user.username, status: "OnSale"
            });
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router.route("/my-history")
    .get(async (req, res) => {
        try {
            const docs = await Auction.find({
                $or: [{ buyer: req.user.username, status: "Sold" },
                    { bidders: req.user.username, status: "Sold" }]
            });
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

module.exports = router;
