const telefon = (tab) => {
    if (tab.constructor !== Array) {
        throw "Parameter is not an array";
    }

    var str = tab.join("");

    if(!str.match(/^.{0,1}\d+$/)) {
        throw "Invalid array element";
    }

    if (tab.length !== 9) {
        throw "Invalid number of elements";
    }

    var chunks = str.match(/.{3}/g);

    var result = "+48 "

    result += chunks.join("-");
    console.log(result);
}
telefon([1,2,3,4,5,6,7,8,9]);