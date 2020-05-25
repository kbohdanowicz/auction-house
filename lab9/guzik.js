window.addEventListener('DOMContentLoaded', function () {
    let element = document.getElementsByClassName("spec")[0];
    let button = document.getElementsByTagName("button")[0];
    button.addEventListener("click", addButton);
});

const addButton = () => {
    let li = document.createElement("li");
    li.textContent = "nowy";
    li.setAttribute("class", "spec");

    let button = document.createElement("button")
    button.textContent = "Spec";
    button.addEventListener("click", addButton);

    li.appendChild(button);
    insertAfter(li, event.currentTarget.parentNode);
};
  

//https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};