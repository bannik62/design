// Contenu HTML en tant que chaîne de caractères
export async function dynamicHTML() {
  
// Créer un nouvel élément div pour contenir le contenu dynamique
const container = document.createElement('div');
container.id = 'admin';

// Ajouter le contenu HTML dans le div
container.innerHTML = `
  <h1>Generateur d'articles</h1>
  <div id="prompt">
    <img id="logoai" src="../img/OpenAI.svg" alt="logo" />
    <div>
      <label for="role"> Role de l'Ia</label>
      <input name="role" type="text" />
    </div>
    <div>
      <label for="resume">Descriptif de l'article</label>
      <textarea name="resume" id="" cols="100" rows="20"></textarea>
    </div>
  </div>
`;

// Créer un nouvel élément span pour le bouton "envoyer"
const span = document.createElement('span');
span.id = 'btnReq';

// Créer un bouton à l'intérieur du span
const button = document.createElement('button');
button.className = 'btnReqcl';
button.textContent = 'envoyer';

// Ajouter le bouton au span
span.appendChild(button);

// Ajouter le span au contenu dynamique
container.appendChild(span);

// Créer un nouvel élément footer
const footer = document.createElement('footer');
footer.className = 'footer';

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
const style = document.createElement('style');
style.textContent = `
  #admin {  
    top: 95px;
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
  #prompt {
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #btnReq {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  #logoai {
    position: absolute;
    top: -32px;
    right: 10px;
    width: 300px;
  }
  textarea {
    width: 100%; /* Remplir la largeur du conteneur */
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
  .footer-content ul li a:hover {
    text-decoration: underline;
  }
`;

// Créer un élément script pour charger le fichier JavaScript externe
const script = document.createElement('script');
script.type = 'module';
script.src = './js/domdynamique.js';

// Ajouter tous les éléments au document
document.body.appendChild(container);
document.body.appendChild(footer);
document.head.appendChild(style);
document.head.appendChild(script);

} 
;

export default dynamicHTML;
