const express = require("express");
const router = express.Router();

const model = require("../model");
const User = model.user;
const ChatRoom = model.chatRoom;
const errorHandler = model.errorHandler;

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

router
    .route("/")
    .get((req, res) => {
        res.render("index", {
            user: req.user
        });
    })
    .all(rejectMethod);

module.exports = router;
