const zadanie1 = () => {
    const proPlan = document.getElementById("pro-plan");

    const listUnstyled = proPlan.getElementsByClassName("list-unstyled").item(0);

    const fourthItem = listUnstyled.children.item(3);

    fourthItem.innerText = "Wsparcie telefoniczne 24/7";
};

const zadanie2 = () => {
    const cardDeck = document.getElementsByClassName("card-deck").item(0);

    const proPlan = document.getElementById("pro-plan")

    const proPlanDeepClone = proPlan.cloneNode(true);

    cardDeck.removeChild(proPlan);

    cardDeck.appendChild(proPlanDeepClone);
};
