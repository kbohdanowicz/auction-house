const express = require("express");
const router = new express.Router();
const model = require("../model");
const Auction = model.Auction;

const routeMethods = require("./routeMiddleware");
const isAuth = routeMethods.isAuth;
const rejectMethod = routeMethods.rejectMethod;

router.route("/start")
    .patch(isAuth, (req, res) => {
        const filter = {
            _id: req.body.id,
            seller: req.user.username
        };
        Auction.findOne(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else if (doc.seller === req.user.username &&
                       doc.status === "New") {
                doc.status = "OnSale";
                if (doc.type === "Bid") {
                    const tempTime = doc.duration;
                    // TODO zmienic
                    doc.duration = new Date(new Date().getTime() + doc.duration).getTime();
                    console.dir(doc.duration);
                    doc.save();

                    res.json(doc);
                    console.dir("Timeout started");
                    setTimeout(() => {
                        Auction.findOne(filter, (err, doc) => {
                            if (err) {
                                res.status(500).json(model.processErrors(err));
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
                    }, tempTime);
                } else {
                    doc.save();
                    console.dir("Product put on sale");
                    res.json(doc);
                }
            } else {
                res.json({ message: "Could not start auction, because it has already started" });
            }
        });
    })
    .all(rejectMethod);

// TODO route /api/auction/id=:id/buy
// TODO route /api/auction/id=:id/bid

router.route("/auction")
    .get((req, res) => {
        Auction.findById(req.body.id, (err, doc) => {
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
            let auction = {};
            // TODO try auction.duration = body.duration;
            if (req.body.type === "Bid") {
                auction = new Auction({
                    name: body.name,
                    price: body.price,
                    type: body.type,
                    seller: user.username,
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
    .patch(isAuth, async (req, res) => { // TODO zrobic osobno buy i update status
        const filter = req.body.id;
        const update = {};
        const body = req.body;
        if (body.seller === req.user.username) {
            if (body.name) {
                update.name = body.name;
            }
            if (body.type) {
                update.type = body.type;
            }
            if (body.duration || body.duration === "") {
                update.duration = body.duration;
            }
        }
        if (body.status) {
            update.status = body.status;
        }
        // console.dir(req.body);
        // console.dir(update);
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
    .delete(isAuth, (req, res) => {
        const filter = {
            _id: req.body.id,
            seller: req.user.username
        };
        Auction.findOneAndDelete(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                if (doc === null) {
                    res.json({
                        message: "Could not find auction or you are not an owner"
                    });
                } else {
                    res.json({
                        message: "Auction successfully deleted"
                    });
                }
            }
        }
        );
    })
    .all(rejectMethod);

router
    .route("/auctions")
    .get(async (req, res) => {
        try {
            const docs = await Auction.find({
                status: "OnSale"
            }).limit(5);
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router.route("/my-bids")
    .get(isAuth, async (req, res) => {
        try {
            const docs = await Auction.find({
                bidders: req.user.username,
                status: "OnSale"
            });
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router.route("/my-auctions")
    .get(isAuth, async (req, res) => {
        try {
            const docs = await Auction.find({
                $or: [{ seller: req.user.username, status: "New" },
                    { seller: req.user.username, status: "OnSale" }
                ]
            });
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

router.route("/my-history")
    .get(isAuth, async (req, res) => {
        try {
            const docs = await Auction.find({
                $or: [{ highestBidder: req.user.username, status: "Sold" },
                    { seller: req.user.username, status: "Sold" },
                    { highestBidder: req.user.username, status: "Ignored" },
                    { seller: req.user.username, status: "Ignored" }
                ]
            });
            return res.json(docs);
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    })
    .all(rejectMethod);

module.exports = router;
