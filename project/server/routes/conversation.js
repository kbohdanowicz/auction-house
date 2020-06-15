const express = require("express");
const router = new express.Router();
const model = require("../model");
const Conversation = model.Conversation;

const routeMethods = require("./routeMiddleware");
const isAuth = routeMethods.isAuth;
const rejectMethod = routeMethods.rejectMethod;

router.route("/conversations")
    .get(isAuth, (req, res) => {
        const filter = {
            participants: req.user.username
        };
        Conversation.find(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                res.json(doc);
            }
        });
    })
    .all(rejectMethod);

router
    .route("/conversation/exists")
    .post(isAuth, (req, res) => {
        const filter = {
            $or: [
                { participants: [req.user.username, req.body.otherUser] },
                { participants: [req.body.otherUser, req.user.username] }
            ]
        };
        Conversation.findOne(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                res.json(doc);
            }
        });
    })
    .all(rejectMethod);

router.route("/conversation")
    .get(isAuth, (req, res) => {
        const filter = req.body.id;
        Conversation.findById(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                res.json(doc);
            }
        });
    })
    .post(isAuth, async (req, res) => {
        try {
            const user = req.user;
            const body = req.body;
            let conversation = {};
            conversation = new Conversation({
                participants: [user.username, body.otherUser],
                messages: []
            });
            const doc = await conversation.save();
            res.json(doc);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

module.exports = router;
