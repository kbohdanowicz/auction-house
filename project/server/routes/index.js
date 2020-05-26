const express = require("express");
const router = express.Router();

const model = require("../model");
const User = model.user;
const Auction = model.auction;
// eslint-disable-next-line no-unused-vars
const ChatRoom = model.chatRoom;

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// Uwierzytelnianie
const authenticate = (req, res, fun) => {
    if (req.isAuthenticated()) {
        return fun();
    } else {
        res.status(403).json({
            message: "Not authenticated"
        });
    }
};

// Wyłapywanie odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router
    .route("/")
    .get(authenticate, (req, res) => {
        res.render("index", {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })
    .all(rejectMethod);

router
    .route("/api/login")
    .post(passport.authenticate("local"), async (req, res) => {
        await res.status(200);
    })
    .all(rejectMethod);

router
    .route("/api/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/api/register")
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

router
    .route("/api/users")
    .get(passport.authenticate("basic", {
        session: false
    }), (req, res) => {
        User.find({}, (err, data) => {
            if (err) {
                res.code(500);
            } else {
                res.json(data);
            }
        });
    })
    .all(rejectMethod);

router
    .route("/api/auctions")
    .get(async (req, res) => {
        try {
            var arr = [];
            for await (const doc of Auction.find()) {
                arr.push(doc);
                console.log(doc);
            }
            console.log(arr);
            return res.send(arr);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    })
    .post(authenticate, async (req, res) => {
        try {
            const user = req.user;
            const body = req.body;
            const auction = new Auction({
                name: body.name,
                description: body.description,
                price: body.price,
                category: body.category,
                seller: user,
                buyer: null,
                timeLeft: body.timeLeft,
                isFinished: false
            });
            const doc = await auction.save();
            res.json(doc);
            console.log("Auction posted");
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

module.exports = router;
