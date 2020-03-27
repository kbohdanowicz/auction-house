const fun1 = (n) => {
    return n * n;
}

const fun2 = (n) => {
    return n + 1;
}

const callback = (n, fun, cb) => {
    setTimeout(() => {
        console.log(`Obliczam „${fun}”`);
        cb(fun(n));
    }, Math.random() * 1000);
}

const poKolei = (n, fun1, fun2, cb) => {
    



};

//poKolei(fun1,fun2,

const getFileViaCallback = (url, cb) => {
    setTimeout(() => {
        console.log(`pobieram „${url}”`);
        cb(`zawartość „${url}”`);
    }, Math.random() * 1000);
}

title("1. callbacks (wywołania zwrotne)");

console.log("początek");

getFileViaCallback("plik1", (dane) => {
    console.log(`pobrałem: ${dane}`);
    
    getFileViaCallback("plik2", (dane) => {
        console.log(`pobrałem: ${dane}`);
        console.log("koniec");
    });
});