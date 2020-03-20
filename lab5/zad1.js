const groupBy = (tab, key) => {
    let myMap = new Map();

    tab.forEach(el => {
        if(myMap.get(key(el)) == null) {
            myMap.set(key(el), new Array());
        }
        myMap.get(key(el)).push(el);
    });

    return myMap;
}

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0));
