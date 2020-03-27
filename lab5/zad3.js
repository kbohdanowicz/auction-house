String.prototype.nbsp = function() {
    return this.replace(/\s[a|i|o|u|w|z]\s/gm, function(word) {
        return " " + word.trim() + "&nbsp;";
    })
};

let tekst = 'Ala i As poszli w las';
console.log(tekst.nbsp());