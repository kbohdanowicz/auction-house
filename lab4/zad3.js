String.prototype.nbsp = function() {
    return this.replace(/ [a|i|o|u|w|z] /gm, function(word) {
        return " " + word.trim() + "&nbsp;";
    })
};

let tekst = 'Ala i As poszli w las';
console.log(tekst.nbsp());