var lastDisplayedId = null;

function toggleExperience(id) {
    var div = document.querySelector('.' + id); // Sélectionnez la div correspondante

    // Masquer la dernière div affichée
    if (lastDisplayedId !== null) {
        var lastDiv = document.querySelector('.' + lastDisplayedId);
        if (lastDiv) {
            lastDiv.style.display = 'none';
        }
    }

    // Afficher la nouvelle div
    if (div) {
        div.style.display = 'block';
        lastDisplayedId = id;
    }
}

let rightCo = document.querySelector(".rightCo")
let borderLeft = document.querySelector(".borderLeft")
let absoluteMargin = document.querySelector(".absoluteMargin ")
let relative2 = document.querySelector(".relative2")
let absolutexpList = document.querySelectorAll(".absolutexp.borderLeft");
console.log(absolutexpList);

document.getElementById('toggleDarkMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    rightCo.classList.toggle('dark-mode');
    borderLeft.classList.toggle('dark-mode')
    relative2.classList.toggle('dark-mode')
    absoluteMargin.classList.toggle('dark-mode')
    absolutexpList.forEach(element => {
        element.classList.toggle('dark-mode');
    });
});



