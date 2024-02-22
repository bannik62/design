console.log("helloa");


// Sélectionne le bouton par son ID
const buttonCv = document.getElementById('buttonCv');

// Ajoute un écouteur d'événement au bouton pour le clic
buttonCv.addEventListener('click', function() {
  console.log('good');
  window.open("./cv/cv.html", "_blank");
});


window.addEventListener('scroll', function() {
  let scrollText = document.getElementById('signature');
  let logo = this.document.querySelector('#logo')
  let scrollPosition = window.scrollY;
  let borderBottom = this.document.getElementById("borderBottom")
  let btCV = document.getElementById("buttonCv")

  // Ici, vous pouvez ajuster la valeur 200 selon la position de défilement souhaitée pour faire apparaître le texte
  if (scrollPosition > 400) {
      scrollText.classList.add('visible'); // Ajoute la classe 'visible' pour faire apparaître le texte
  } else {
      scrollText.classList.remove('visible'); // Supprime la classe 'visible' pour faire disparaître le texte
  }
    if (scrollPosition > 150) {
      logo.classList.add('visible'); // Ajoute la classe 'visible' pour faire apparaître le texte
  } else {
      logo.classList.remove('visible'); // Supprime la classe 'visible' pour faire disparaître le texte
  }
    if (scrollPosition > 15) {
      borderBottom.classList.add('hidden');
      borderBottom.classList.remove('visible')
      buttonCv.classList.add("zindex")
    } else {
      borderBottom.classList.remove('hidden'); // Supprime la classe 'visible' pour faire disparaître le texte
      borderBottom.classList.add('visible') 
              buttonCv.classList.remove("zindex")
    }

    if (scrollPosition > 1500) {
      console.log("1500");
      arrow()
    }else  if (scrollPosition < 1500){
      arrowReverse()
    }
  
});


  
window.addEventListener('resize', function() {
  console.log('hello');
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let elementWidth = 150; // Largeur de votre élément en pixels
  let elementHeight = 200; // Hauteur de votre élément en pixels

  // Calcul de la différence de largeur d'écran avant et après le redimensionnement
  let screenWidthDifference = screenWidth - lastScreenWidth;
  let leftOffset = parseFloat(document.getElementById('buttonCv').style.left) || 0;

  // Calcul de la nouvelle position horizontale de l'élément en ajoutant la différence de largeur d'écran
  leftOffset += screenWidthDifference;

  // Mise à jour de la position horizontale de l'élément
  document.getElementById('buttonCv').style.left = leftOffset + 'px';

  // Mise à jour de la largeur de l'élément en ajoutant la différence de largeur d'écran
  let currentWidth = parseFloat(document.getElementById('buttonCv').style.width) || elementWidth;
  let newWidth = currentWidth + screenWidthDifference /3;
  document.getElementById('buttonCv').style.width = newWidth + 'px';

  // Mise à jour de la dernière largeur d'écran
  lastScreenWidth = screenWidth;
});

// Initialiser la variable lastScreenWidth avec la largeur de l'écran au chargement de la page
let lastScreenWidth = window.innerWidth;


function arrow() {
  var animatedDiv = document.getElementById('download');
  // Pour déclencher l'animation, on ajoute une petite pause avant de changer la position
  setTimeout(function() {
    let screenWidth = window.innerWidth;

    animatedDiv.style.left = 'calc(50% - 500px)'; // Au milieu de l'écran
  }, 10);
};

function arrowReverse() {
  var animatedDiv = document.getElementById('download');
  // Pour déclencher l'animation, on ajoute une petite pause avant de changer la position
  setTimeout(function() {
    let screenWidth = window.innerWidth;

    animatedDiv.style.right= 'calc(50% - 500px)'; // Au milieu de l'écran
  }, 10);
};


  
