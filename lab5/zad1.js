const telefon = (tab) => {
    if (tab.constructor !== Array) {
        throw "Parameter is not an array";
    }

    let str = tab.join("");

    if(!str.match(/.{0,1}\d+/)) {
        throw "Invalid array element";
    }

    if (tab.length !== 9) {
        throw "Invalid number of elements";
    }

    let chunks = str.match(/.{3}/g);

    let result = "+48 "

    result += chunks.join("-");

    return result;
}

console.log(telefon([1,2,3,4,5,6,7,8,9]));