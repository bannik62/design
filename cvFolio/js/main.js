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


