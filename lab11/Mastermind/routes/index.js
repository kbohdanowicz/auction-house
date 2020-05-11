"use strict";

const express = require("express");
const router = express.Router();

const model = require("../model");
const User = model.user;
const GameData = model.gameData;

const rateGuess = require("./rateGuess");

// Passport.js i narzędzie do szyfrowania haseł
const passport = require("../passport");
const bcrypt = require("../bcrypt");

// „wyłapywanie”  odwołań nieobsługiwanymi metodami HTTP
const rejectMethod = (_req, res, _next) => {
    // Method Not Allowed
    res.sendStatus(405);
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

router  
    .route("/")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("index", {
                user: req.user
            })
        }
        else{
            res.redirect("/login")
        }
    })

router
    .route("/game-history")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("game-history", {
                user: req.user
            })
        }
        else{
            res.redirect("/login")
        }
    })
    .all(rejectMethod);

router  
    .route("/mmind")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("mmind")
        }
        else{
            res.redirect("/login")
        }
    })
    .post((req, res) => {
        let params = req.body;
        let solution = [];

        for (let i = 0; i < params.size; i++) {
            solution[i] = getRandomInt(params.dim).toString();
        }
        console.log(solution);
        req.session.gameData = 
        {
            "size" : params.size,
            "dim" : params.dim,
            "max" : params.max,
            "solution" : solution
        }
        // tworzymy nową grę
        res.json({
            msg: "nowa gra"
        });
    })
    .patch((req, res) => {
        let playerGuess = rateGuess.rate(
            req.body.guessArray,
            req.session.gameData.solution
        );
        
        let winState = playerGuess.black === playerGuess.guessRated.length;

        if (req.body.movesLeft - 1 <= 0 || winState) {
            let currentGame = new GameData({
                lastGuess: req.body.guessArray.toString(),
                gameWon: winState,
                black: playerGuess.black,
                white: playerGuess.white
            });
            User.findOneAndUpdate(
                { username: req.user.username },
                { $push: { gameHistory: currentGame } },
                () => {}
            )
        }
       
        // oceniamy ruch
        res.json({
            msg: "ocena ruchu",
            black: playerGuess.black,
            white: playerGuess.white
        });
    })
    .all(rejectMethod);
    
router
    .route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post(passport.authenticate("local"), async (req, res) => {
        await res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/logout")
    .get((req, res) => {
        req.logout();
        res.redirect("/");
    })
    .all(rejectMethod);

router
    .route("/register")
    // „dla treningu”, inaczej niż w przykładzie z wykładu
    // (tsw-mongo-crud) użyjemy tutaj async/await
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                username: req.body.username,
                password: passwordHash
            });
            let doc = await user.save();
            res.json(doc);
        } catch (err) {
            if (!req.body.password) {
                // Unprocessable Entity
                res.status(422).json({
                    password: "Error – password must not be empty!"
                });
            } else {
                res.status(422).json(User.processErrors(err));
            }
        }
    })
    .all(rejectMethod);

// przykładowe „API” – oczwiście musi być serwowane przez HTTPS!
router
    .route("/api/users")
    // tutaj uwierzytelniamy się przez HTTP – metodą Basic
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

module.exports = router;