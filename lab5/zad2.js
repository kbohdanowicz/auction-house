const odwracanie = (napis) => {
    if (napis.constructor !== String) {
        throw "Parameter is not a string";
    }

    return napis.replace(/[A-z]+/gm, function(word) {
        return word.length > 4 ? word.split('').reverse().join(''):word;
    });
}

console.log(odwracanie("Dzik jest dziki, dzik jest zły. Dzik ma bardzo ostre kły."));
