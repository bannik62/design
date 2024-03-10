import { OpenAI } from "openai";
import express from 'express';
import bodyParser from 'body-parser';

import { sauvegarderReponse } from '../../auth/modules/modulesJs.mjs';
import { sendEmail }          from '../../auth/modules/modulesJs.mjs';
const app = express();
const port = "3000";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const openai = new OpenAI({ apiKey: "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" });

const prompts = [
`tu es un expert  en informatique et journaliste:   fait moi un article  sur des tips et des memo  linux  ainsi que des  tuto .
tu devra ajouter la mise en page html autour du texte .
cela devra comporter un titre une intro et l article mimimum 100 ligne 
exemple :
<h1>titre</h1>
<H3>réumé intro allechante</h3>
et au de <p>  que tu as besoins pour ecrire le texte . merci `]

function selectionnerPromptAleatoire() {
    const index = Math.floor(Math.random() * prompts.length);
    return prompts[index];
}

async function interrogerAPIOpenAI() {
    const prompt = selectionnerPromptAleatoire();

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt}],
            model: "gpt-3.5-turbo",
        });
        const reponse = completion.choices[0];
        console.log(reponse);
        sauvegarderReponse(reponse, 'reponse_openai.txt');
        sendEmail(reponse); 
        return reponse;
    } catch (error) {
        console.error("Une erreur s'est produite lors de l'interrogation de l'API OpenAI:", error);
        throw error;
    }
}

// Call interrogerAPIOpenAI() when the server starts
interrogerAPIOpenAI()





app.get('/replay', async (req, res) => {
    try {
        await interrogerAPIOpenAI(); // Appeler la fonction interrogerAPIOpenAI
        res.send("Génération relancée avec succès !");
    } catch (error) {
        console.error("Une erreur s'est produite lors du rappel de la fonction interrogerAPIOpenAI :", error);
        res.status(500).send("Erreur lors du rappel de la fonction interrogerAPIOpenAI.");
    }
});

async function loadArticles(dossierArticless) {
    let articlesHTML = "";
  
    try {
      const files = await fsPromises.readdir(dossierArticless);
  
      for (const file of files) {
        const filePath = path.join(dossierArticless, file);
        if (file.endsWith(".js")) {
          const { default: articleModule } = await import(filePath);
          articlesHTML += articleModule;
        }
      }
  
      return articlesHTML;
    } catch (error) {
      console.error("Erreur lors du chargement des articles :", error);
      throw error;
    }
  }

  
app.get("/maj", async (req, res) => {
    try {
      // Charger les articles en utilisant la fonction chargerArticles
      const articles = await loadArticles(dossierArticless);
      console.log(articles);
      // Envoyer les articles au client
      res.send(articles);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors du chargement des articles :",
        error
      );
      res.status(500).json({ error: "Erreur lors du chargement des articles" });
    }
  });
// Start server
app.listen(port, () => {
    console.log("port 3000 logiquement : "+ 3000);
    console.log(`Server running on port ${port}`);
});
