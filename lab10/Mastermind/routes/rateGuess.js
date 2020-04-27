module.exports = {
    rate: function (guess, solution) {
        const solSize = solution.length;

        let blackCount = 0; // correct spot
        let whiteCount = 0; // wrong spot

        let guessRated = [];
        let solutionRated = [];

        for (let i = 0; i < solSize; i++) {
            guessRated[i] = false;
            solutionRated[i] = false;
        }

        for(i = 0; i < solSize; i++) {
            if (guessRated[i]) continue;
            if (guess[i] === solution[i]) {
                blackCount++;
                guessRated[i] = true;
                solutionRated[i] = true;
            }
        }

        for(i = 0; i < solSize; i++) {
            if (guessRated[i]) continue;

            for(j = 0; j < solSize; j++) {
                if (solutionRated[j]) continue;

                if (guess[i] === solution[j]) {
                    whiteCount++;
                    guessRated[i] = true;
                    solutionRated[j] = true;
                }
            }
        }

        return result = {
            black : blackCount,
            white : whiteCount,
            guessRated: guessRated,
            solutionRated: solutionRated
        };
    }
}