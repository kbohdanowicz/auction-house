const groupMap = (tab, key, fun) => {
    let myMap = new Map();

    tab.forEach(el => {
        if(myMap.get(key(el)) == null) {
            myMap.set(key(el), new Array());
        }
        myMap.get(key(el)).push(fun(el));
    });

    return myMap;
}

console.log(groupMap([3,2,4,4,3], n => n % 2 === 0, n => n + 1));
