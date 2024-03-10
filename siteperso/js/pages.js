import { extensionPage } from "../pages/extension.js";
import { toolsPage } from "../pages/tools.js";
import { proposPage } from "../pages/propos.js";

let content = document.getElementById("content");

let post = document.getElementById("post");
let extension = document.getElementById("extension");
let tools = document.getElementById("tools");
let propos = document.getElementById("propos");
const blog = document.getElementById('blog');


extension.addEventListener("click", function () {
  content.innerHTML = extensionPage;
});

tools.addEventListener("click", function () {
  content.innerHTML = toolsPage;
});

propos.addEventListener("click", function () {
  content.innerHTML = proposPage;
});


blog.addEventListener("click", function () {
  async function displayArticle() {
    const articleModuleUrl = "https://codeurbase.fr:3000/load";
    try {
      content.innerHTML = ""; // Effacer le contenu précédent

      const response = await fetch(articleModuleUrl);
      let articleHTML = await response.text(); // Récupérer le contenu de la réponse

      console.log(`articleshtml ${articleHTML}`);

      // Supprimer les caractères "\" entre guillemets doubles
      articleHTML = articleHTML.replace(/\\"/g, '"');

      // Créer un élément div pour contenir le contenu HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = articleHTML;

      // Appeler la fonction pour supprimer les sauts de ligne en dehors des balises HTML
      removeLineBreaksOutsideTags(tempDiv);

      // Séparer chaque article individuel
      const articles = tempDiv.querySelectorAll(".article");

      // Insérer chaque article dans le conteneur de contenu
      articles.forEach((article) => {
        const articleContainer = document.createElement("div");
        articleContainer.classList.add("article-container");
        articleContainer.appendChild(article);
        content.appendChild(articleContainer);
      });
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du chargement du module d'article:",
        error
      );
    }
  }

  // Fonction récursive pour supprimer les sauts de ligne en dehors des balises HTML
  function removeLineBreaksOutsideTags(element) {
    // Vérifier si l'élément est un nœud de texte
    if (element.nodeType === Node.TEXT_NODE) {
      // Remplacer les sauts de ligne par des espaces
      element.nodeValue = element.nodeValue.replace(/\n/g, "");
    } else {
      // Parcourir les enfants de l'élément
      for (let i = 0; i < element.childNodes.length; i++) {
        const childNode = element.childNodes[i];
        // Appeler la fonction de manière récursive pour chaque enfant
        removeLineBreaksOutsideTags(childNode);
      }
    }
  }

  displayArticle();
});


post.addEventListener("click", async () => {
  const token = localStorage.getItem("codeurBaseToken");

  if (token) {
    console.log("token " + token);
    try {
      const response = await fetch("https://codeurbase.fr:3005/key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data 2 " + data);
        if (data === true) {
          content.innerHTML = "";
          const container = document.createElement("div");
          container.id = "admin";

          // Création du titre
          const title = document.createElement("h1");
          title.textContent = "Générateur d'articles";

          // Création de l'image
          const logoAI = document.createElement("img");
          logoAI.id = "logoai";
          logoAI.src = "../img/OpenAI.svg";
          logoAI.alt = "logo";

          // Ajout du titre et de l'image au container
          container.appendChild(title);
          container.appendChild(logoAI);

          // Création des balises label
          const roleLabel = document.createElement("label");
          const resumeLabel = document.createElement("label");
          // Ajout du texte à chaque balise label
          roleLabel.textContent = "Role de l'Ia";
          resumeLabel.textContent = "Descriptif de l'article";
          // Création des balises input et textarea
          const roleInput = document.createElement("input");
          const resumeTextarea = document.createElement("textarea");
          // Attribution des attributs nécessaires aux balises input et textarea
          roleInput.setAttribute("type", "text");
          roleInput.setAttribute("name", "role");
          resumeTextarea.setAttribute("name", "resume");
          resumeTextarea.setAttribute("cols", "100");
          resumeTextarea.setAttribute("rows", "20");

          // Ajout de l'input et de la textarea à chaque label
          roleLabel.appendChild(roleInput);
          resumeLabel.appendChild(resumeTextarea);

          // Ajout des balises label au container
          container.appendChild(roleLabel);
          container.appendChild(resumeLabel);

          // Créer un nouvel élément span pour le bouton "envoyer"
          const span = document.createElement("span");
          span.id = "btnReq";

          // Créer un bouton à l'intérieur du span
          const button = document.createElement("button");
          button.className = "btnReqcl";
          button.textContent = "envoyer";

          // Ajouter l'attribut onclick au bouton avec la fonction à exécuter
          button.addEventListener("click", async () => {
            // Utilisation du token déjà récupéré précédemment
            if (data === true) {
              console.log("data is good");
              alert('Votre articles et en genération!')

              // Le token est valide, maintenant effectuer la requête vers /articleGpt
              try {
                const role = document.querySelector('input[name="role"]').value;
                const descriptif = document.querySelector(
                  'textarea[name="resume"]'
                ).value;
                console.log("descriptif : " + descriptif);
                console.log("role : " + role);

                const articleResponse = await fetch(
                  `https://codeurbase.fr:3005/gpt?role=${encodeURIComponent(
                    role
                  )}&descriptif=${encodeURIComponent(descriptif)}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (articleResponse.ok) {
                  console.log("data verygood");
                  const articleData = await articleResponse.text();
                  console.log("Réponse de la requête vers /gpt :", articleData);
                  // Traitez la réponse de la requête vers /articleGpt ici
                } else {
                  console.error(
                    "Erreur lors de la requête vers /gpt :",
                    articleResponse.statusText
                  );
                }
              } catch (error) {
                console.error("Erreur lors de la requête vers /gpt :", error);
              }
            } else {
              console.log("Le token n'est pas valide.");
            }
          });

          // Ajouter le bouton au span
          span.appendChild(button);

          // Ajouter le span au contenu dynamique
          container.appendChild(span);

          // Créer un nouvel élément footer
          const footer = document.createElement("footer");
          footer.className = "footer";

          // Ajouter le contenu du footer
          footer.innerHTML = `
            <div class="footer-content">
              <p>blog personel</p>
              <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
              <p>&copy; 2024 CodeurBase.fr</p>
            </div>
          `;

          // Créer un élément style pour le CSS
          const style = document.createElement("style");
          style.textContent = `
            #admin {  
              top: 50px;
              position: relative;
              margin: 27px 10px 200px 10px;
              padding: 50px;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              padding: 13px;
              height: auto;
              border: 2px solid rgb(26, 169, 88);
              color: greenyellow;
              background: linear-gradient(145deg, #5a5656, #0d150d);
              border-radius: 2%;
              box-shadow: inset 2.91px 2.91px 15px green, inset -4.91px -4.91px 4px #6e6e6e;
            }
            h1{
              padding: 5px
            }
            label input{
              margin:15px
            }
            #prompt {
              padding: 25px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            #btnReq {
              position: absolute;
              right: 20px;
              bottom: 40px;
            }
            #logoai {
              position: absolute;
              top: -32px;
              right: 10px;
              width: 300px;
            }
            textarea {
              width: 98%; /* Remplir la largeur du conteneur */
              margin:20px
            }
            .footer {
              background-color: black;
              color: white;
              padding: 20px 0;
              position: absolute;
              width: 100vw;
              bottom: 0;
            }
            .footer-content {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
            }
            .footer-content p,
            .footer-content ul {
              margin: 0;
              padding: 0 10px;
            }
            .footer-content ul {
              list-style: none;
            }
            .footer-content ul li {
              display: inline;
              margin-right: 20px;
            }
            .footer-content ul li:last-child {
              margin-right: 0;
            }
            .footer-content ul li a {
              color: white;
              text-decoration: none;
            }
          `;

          // Ajouter tous les éléments au document
          content.appendChild(container);
          content.appendChild(footer);
          content.appendChild(style);
        } else {
          console.log(data);
          console.log("Le token n'est pas valide.");
        }
      } else {
        console.error(
          "Erreur lors de la vérification du token :",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
    }
  } else {
    console.log("Pas de token disponible.");
  }
});
