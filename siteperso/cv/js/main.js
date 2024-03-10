var lastDisplayedId = null;

function toggleExperience(id) {
  var div = document.querySelector("." + id); // Sélectionnez la div correspondante

  // Masquer la dernière div affichée
  if (lastDisplayedId !== null) {
    var lastDiv = document.querySelector("." + lastDisplayedId);
    if (lastDiv) {
      lastDiv.style.display = "none";
    }
  }

  // Afficher la nouvelle div
  if (div) {
    div.style.display = "block";
    lastDisplayedId = id;
  }
}

let rightCo = document.querySelector(".rightCo");
let borderLeft = document.querySelector(".borderLeft");
let absoluteMargin = document.querySelector(".absoluteMargin ");
let relative2 = document.querySelector(".relative2");
let absolutexpList = document.querySelectorAll(".absolutexp.borderLeft");
let marginul = document.querySelectorAll(
  ".bold.image-list.dark-mode"
);
console.log(absolutexpList);

document
  .getElementById("toggleDarkMode")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    rightCo.classList.toggle("dark-mode");
    borderLeft.classList.toggle("dark-mode");
    relative2.classList.toggle("dark-mode");
    absoluteMargin.classList.toggle("dark-mode");

    absolutexpList.forEach((element) => {
      element.classList.toggle("dark-mode");
    });
    marginul.forEach((element) => {
      element.classList.toggle("dark-mode");
    });
  });

// Sélectionnez le bouton draggable
var draggableBtn = document.querySelector(".toggleDarkMode");

// Variables pour stocker la position initiale du bouton et le décalage entre la souris et le coin supérieur gauche du bouton
var initialX, initialY, offsetX, offsetY;

// Fonction pour démarrer le glisser-déposer
function startDrag(event) {
  // Empêche le comportement par défaut (comme le déplacement de l'élément)
  event.preventDefault();

  // Stocke la position initiale de la souris par rapport au coin supérieur gauche du bouton
  offsetX = event.clientX - draggableBtn.getBoundingClientRect().left;
  offsetY = event.clientY - draggableBtn.getBoundingClientRect().top;

  // Ajoute des écouteurs d'événements pour suivre les mouvements de la souris et le relâchement du bouton de la souris
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
}

// Fonction pour effectuer le glisser-déposer
function drag(event) {
  // Calcule la nouvelle position du bouton en fonction de la position de la souris et du décalage
  var newX = event.clientX - offsetX;
  var newY = event.clientY - offsetY;

  // Met à jour la position du bouton
  draggableBtn.style.left = newX + "px";
  draggableBtn.style.top = newY + "px";
}

// Fonction pour arrêter le glisser-déposer
function endDrag(event) {
  // Supprime les écouteurs d'événements une fois le glisser-déposer terminé
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);
}

// Ajoute un écouteur d'événements pour démarrer le glisser-déposer lorsque le bouton est enfoncé
draggableBtn.addEventListener("mousedown", startDrag);
