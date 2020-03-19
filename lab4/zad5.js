String.prototype.podstaw = function(dane) {
    var keys = Object.keys(dane);

    var resultstr = szablon

    keys.forEach(fieldName => {
        let pattern = "\{" + fieldName + "\}";

        let fieldValue = dane[fieldName];

        resultstr = resultstr.split(pattern).join(fieldValue);
    });

    return resultstr;
}

let szablon =
  '<table border="{border}">' +
  '  <tr><td>{first}</td><td>{last}</td></tr>' +
  '</table>';

let dane = {
    first: "Jan",
    last:  "Kowalski",
    pesel: "97042176329"
}

console.log(szablon.podstaw(dane));
