const express = require("express");
const router = new express.Router();
const model = require("../model");
const Auction = model.Auction;

const routeMethods = require("./routeMiddleware");
const isAuth = routeMethods.isAuth;
const rejectMethod = routeMethods.rejectMethod;

const auctionLimit = 4;

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
                    doc.endTime = new Date().getTime() + doc.duration;
                    console.dir(doc.endTime);
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

router.route("/auction")
    .post(isAuth, async (req, res) => {
        try {
            const user = req.user;
            const body = req.body;
            let auction = {};
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
    .patch(isAuth, async (req, res) => {
        const update = {};
        const body = req.body;
        if (body.seller === req.user.username) {
            if (body.name) {
                update.name = body.name;
            }
            if (body.price) {
                update.price = body.price;
            }
            if (body.type) {
                update.type = body.type;
            }
            if (body.duration || body.duration === "") {
                update.duration = body.duration;
            }
        }
        // if (body.highestBidder) {
        //     update.highestBidder = body.highestBidder;
        // }
        // if (body.status) {
        //     update.status = body.status;
        // }
        console.dir(req.body);
        console.dir(update);
        const filter = req.body.id;
        console.dir(filter);
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
        console.log(filter);
        Auction.findOneAndDelete(filter, (err, doc) => {
            if (err) {
                res.status(500).json(model.processErrors(err));
            } else {
                let msg;
                if (doc === null) {
                    msg = "Could not find auction or you are not an owner";
                    res.json({
                        message: msg
                    });
                } else {
                    msg = "Auction successfully deleted";
                    res.json({
                        message: msg
                    });
                }
                console.log(msg);
            }
        }
        );
    })
    .all(rejectMethod);

// Middleware for pagination
const paginatedResultsMid = (filter) => {
    return async (req, res, next) => {
        let tempPage;
        if (req.params.page) {
            tempPage = req.params.page;
        } else {
            tempPage = 1;
        }
        const page = parseInt(tempPage);
        const limit = auctionLimit;

        const skippedPages = (page - 1) * limit;
        try {
            const docs = await Auction.find(
                filter
            ).skip(skippedPages).limit(limit + 1);

            const results = {
                auctions: docs
            };
            if (docs.length > limit) {
                results.nextPage = true;
                docs.pop();
            } else {
                results.nextPage = false;
            }
            if (skippedPages > 0) {
                results.previousPage = true;
            } else {
                results.previousPage = false;
            }
            res.paginatedResults = results;
            next();
        } catch (err) {
            console.log(err);
            res.status(422).json(model.processErrors(err));
        }
    };
};

// Function for pagination
async function paginatedResultsFun (filter, _page) {
    const page = parseInt(_page);
    const limit = auctionLimit;

    const skippedPages = (page - 1) * limit;
    try {
        const docs = await Auction.find(
            filter
        ).skip(skippedPages).limit(limit + 1);
        const results = {
            auctions: docs
        };
        if (docs.length > limit) {
            results.nextPage = true;
            docs.pop();
        } else {
            results.nextPage = false;
        }
        if (skippedPages > 0) {
            results.previousPage = true;
        } else {
            results.previousPage = false;
        }
        return results;
    } catch (err) {
        console.log(err);
        return { myErrorMessage: err };
    };
};

router
    .route("/auctions/page/:page")
    .get(paginatedResultsMid({ status: "OnSale" }), (req, res) => {
        res.json(res.paginatedResults);
    })
    .all(rejectMethod);

router.route("/my-bids/page/:page")
    .get(isAuth, async (req, res) => {
        const filter = {
            bidders: req.user.username,
            status: "OnSale"
        };
        const results = await paginatedResultsFun(filter, req.params.page);
        if (results.myErrorMessage !== undefined) {
            res.status(422).json(model.processErrors(results.myErrorMessage));
        } else {
            res.json(results);
        }
    })
    .all(rejectMethod);

router.route("/my-auctions/page/:page")
    .get(isAuth, async (req, res) => {
        const filter = {
            $or: [
                { seller: req.user.username, status: "New" },
                { seller: req.user.username, status: "OnSale" }
            ]
        };
        const results = await paginatedResultsFun(filter, req.params.page);
        // console.dir(results);
        if (results.myErrorMessage !== undefined) {
            res.status(422).json(model.processErrors(results.myErrorMessage));
        } else {
            res.json(results);
        }
    })
    .all(rejectMethod);

router.route("/my-history/page/:page")
    .get(isAuth, async (req, res) => {
        const filter = {
            $or: [
                { highestBidder: req.user.username, status: "Sold" },
                { seller: req.user.username, status: "Sold" },
                { highestBidder: req.user.username, status: "Ignored" },
                { seller: req.user.username, status: "Ignored" }
            ]
        };
        const results = await paginatedResultsFun(filter, req.params.page);
        if (results.myErrorMessage !== undefined) {
            res.status(422).json(model.processErrors(results.myErrorMessage));
        } else {
            res.json(results);
        }
    })
    .all(rejectMethod);

module.exports = router;
