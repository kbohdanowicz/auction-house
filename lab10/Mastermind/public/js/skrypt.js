/* globals axios: false */
// https://github.com/axios/axios

window.addEventListener("DOMContentLoaded", () => {
    newGame();
});

function newGame() {
    document.getElementById("log").innerHTML = "";

    let size = parseInt(document.getElementById("size").value);
    let dim = parseInt(document.getElementById("dim").value);
    let max = parseInt(document.getElementById("max").value);

    let guessMaxAttr = dim;

    for (let i = 1; i < size; i++) {
        guessMaxAttr *= 10;
        guessMaxAttr += dim;
    }
  
    document.getElementById("guess-input").setAttribute("max", guessMaxAttr);
    document.getElementById("guess-input").setAttribute("maxlength", size);
    document.getElementById("moves-left").innerHTML = max;

    document.getElementById("win-message").style.visibility = "hidden";
    document.getElementById("lose-message").style.visibility = "hidden";

    const resultContainer = document.getElementById("result-container");
    while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.lastChild);
    }

    document.getElementById("guess-btn").disabled = false;
    document.getElementById("guess-input").disabled = false;

    axios
        .post("/mmind", {
            size: size,
            dim: dim,
            max: max
        })
        .then((resp) => {
            console.log("Odpowiedź serwera na POST /mmind:");
            console.dir(resp.data);
        });
}

function guess() {
/*
    guess = guess.split("");
    console.log(guess);

    guess.forEach(element {
        element = element.toString(),
        element += " ";
    }

    console.log(guess);

    guess.join();
    console.log(guess);
*/
    let guessInputValue = document.getElementById("guess-input").value;
    let guessInputArray = guessInputValue.split("");

    axios
        .patch("/mmind", {
            guess: guessInputArray
        })
        .then((resp) => {
            //label 1
            let labelGuessInput = document.createElement("label");
            labelGuessInput.innerHTML = guessInputValue.toString() + "&emsp;&emsp;";

            //label 2 & 3
            let black = resp.data.black;
            let white = resp.data.white;
                
            let labelBlack = document.createElement("label");
            let labelWhite = document.createElement("label");
        
            labelBlack.innerHTML = "B: " + black + "&nbsp;";
            labelWhite.innerHTML = "W: " + white;

            let movesLeft = parseInt(document.getElementById("moves-left").innerHTML);

            const solutionSize = parseInt(document.getElementById("size").value);

            movesLeft--;
            document.getElementById("moves-left").innerHTML = movesLeft;

            if (black === solutionSize) {
                document.getElementById("win-message").style.visibility = "visible";
                document.getElementById("guess-input").disabled = true;
                document.getElementById("guess-btn").disabled = true;
            }
            else if(movesLeft === 0) {
                document.getElementById("lose-message").style.visibility = "visible";
                document.getElementById("guess-input").disabled = true;
                document.getElementById("guess-btn").disabled = true;
            }

            let result = document.createElement("div");
            result.id = "result";
            result.append(labelGuessInput, labelBlack, labelWhite);

            let resultContainer = document.getElementById("result-container");
            resultContainer.appendChild(result);
        });
}
