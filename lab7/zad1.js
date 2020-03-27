const poKolei = (funTab, fcb) => {
    funTab.forEach(element => {
        element(() => {
            console.log("callback");
        });
    });
    fcb();
};

const funTab = [(cb) => {cb();}, (cb) => {cb();}, (cb) => {cb();}];

poKolei(funTab, () => {
    console.log("fcb");
});