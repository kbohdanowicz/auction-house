"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const express = require("express");
const router = express.Router();
const uuid = require("uuidv4").uuid;

const rateGuess = require("./rateGuess");

router.route("/")

    .post((req, res) => {
        let params = req.body;
        
        let solution = [];

        for (let i = 0; i < params.size; i++) {
            solution[i] = getRandomInt(params.dim).toString();
        }
        console.log(solution);

        req.session = 
        {
            "id": uuid(),
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
            req.body.guess,
            req.session.solution,
        );

        // oceniamy ruch
        res.json({
            msg: "ocena ruchu",
            black: playerGuess.black,
            white: playerGuess.white
        });
    });

module.exports = router;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}