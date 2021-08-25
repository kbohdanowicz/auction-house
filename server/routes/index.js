const express = require("express");
const router = express.Router();

const model = require("../model");
const User = model.User;

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

const routeMethods = require("./routeMiddleware");
const isAuth = routeMethods.isAuth;
const rejectMethod = routeMethods.rejectMethod;

router
    .route("/users")
    .get(passport.authenticate("basic", { session: false }), (req, res) => {
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
    .get((req, res) => {
        if (req.isAuthenticated()) {
            const filter = { username: req.user.username };
            User.findOne(filter, (err, doc) => {
                if (err) {
                    res.status(500).send();
                } else {
                    res.json({
                        username: req.user.username,
                        isAuth: req.isAuthenticated(),
                        notifications: doc.notifications,
                        isNewNotification: doc.isNewNotification
                    });
                }
            });
        } else {
            res.send({
                message: "Not logged in"
            });
        }
    })
    .patch(isAuth, (req, res) => {
        const filter = {
            username: req.user.username
        };
        User.findOneAndUpdate(
            filter,
            { isNewNotification: false },
            (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                    console.dir("isNewNotification set to false");
                }
            }
        );
    })
    .all(rejectMethod);

router
    .route("/login")
    .post(passport.authenticate("local"), async (req, res) => {
        await res.json({
            message: "success"
        });
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get(isAuth, (req, res) => {
        console.log("Logging out");
        req.logout();
        res.status(200).json({
            isAuth: req.isAuthenticated()
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

module.exports = router;
