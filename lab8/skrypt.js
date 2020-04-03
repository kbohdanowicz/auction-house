const zadanie1 = () => {
    const proPlan = document.getElementById("pro-plan");

    const listUnstyled = proPlan.getElementsByClassName("list-unstyled").item(0);

    const fourthItem = listUnstyled.children.item(3);

    fourthItem.innerText = "Wsparcie telefoniczne 24/7";
};


