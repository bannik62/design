let send = document.getElementById("send");

function verifierKonamiCode() {
  // Initialisez un tableau pour stocker la séquence de touches
  let sequence = [];
  // Définissez la séquence cible que vous souhaitez détecter
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  document.addEventListener("keydown", (event) => {
    sequence.push(event.key);

    // Vérifiez si la séquence actuelle correspond à la séquence cible
    if (sequence.join("") === konamiCode.slice(0, sequence.length).join("")) {
      // La séquence correspond à une partie de la séquence cible, continuez à écouter les touches
      if (sequence.join("") === konamiCode.join("")) {
        afficherPopup();
        document
          .getElementById("fermerPopupBtn")
          .addEventListener("click", fermerPopup);

        // La séquence a été détectée, faites quelque chose ici
        console.log("Séquence détectée !");
        // Remettez la séquence à vide pour permettre la détection d'une nouvelle séquence
        sequence = [];
      }
    } else {
      // La séquence actuelle ne correspond pas au début de la séquence cible, réinitialisez la séquence
      sequence = [];
    }
  });
}
verifierKonamiCode();

function fermerPopup() {
  document.getElementById("popup").style.display = "none";
}
function afficherPopup() {
  document.getElementById("popup").style.display = "block";
}

send.addEventListener("click", (e) => {
  // Fonction pour se connecter et obtenir un token JWT
  const login = async (username, password) => {
    try {
      const response = await fetch("https://codeurbase.fr:3005/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        // Stocke le token dans le stockage local
        localStorage.setItem("codeurBaseToken", token);
        verifierTokenLocalStorage();
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Erreur de connexion:", errorData.message);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = form.elements.name.value;
    const password = form.elements.password.value;
    await login(username, password);
  });
});

// let post = document.getElementById("post")

const verifierTokenLocalStorage = async () => {
  const token = localStorage.getItem("codeurBaseToken");
  const post = document.getElementById("post");

  if (!token) {
    // Si aucun token n'est présent, cacher le bouton
    post.style.display = "none";
    return;
  }

  try {
    const response = await fetch("https://codeurbase.fr:3005/key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 

      },
      body: JSON.stringify({ token }),
    });
    const data = await response.text();
    console.log("data " + data);
    if (data === "true") {
      // Afficher le bouton si le token est valide
      post.style.display = "block";
      fermerPopup();
    } else {
      post.style.display = "none";
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    // En cas d'erreur, cacher le bouton par sécurité
    post.style.display = "none";
  }
};
window.addEventListener("load", () => verifierTokenLocalStorage());



