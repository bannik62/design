import { OpenAI } from "openai";
import express from "express";
import bodyParser from "body-parser";
import https from "https";
import fs from "fs";
import cors from "cors"; // Importez le middleware cors

import { loadArticles } from "../../auth/modules/modulesJs.mjs";
import { sauvegarderReponse } from "../../auth/modules/modulesJs.mjs";
import { sendEmail } from "../../auth/modules/modulesJs.mjs";
import { convertAutoToJs } from "../../auth/modules/modulesJs.mjs";
import dotenv from "dotenv";

dotenv.config();
const gptKey = process.env.DB_GPTKEY;

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/codeurbase.fr/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/codeurbase.fr/fullchain.pem"),
};
const app = express();
const port = "3000";
app.use(cors()); // Utilisez le middleware cors pour autoriser toutes les origines
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const prompts = [
  `tu es un expert  en informatique et journaliste:   fait moi un article  sur des tips et des memo  linux  ainsi que des  tuto .
tu devra ajouter la mise en page html autour du texte .
cela devra comporter un titre une intro et l article mimimum 100 ligne 
exemple :
<h1>titre</h1>
<H3>réumé intro allechante</h3>
et au de <p>  que tu as besoins pour ecrire le texte . merci `,
];

function selectionnerPromptAleatoire() {
  const index = Math.floor(Math.random() * prompts.length);
  return prompts[index];
}

async function interrogerAPIOpenAI() {
  const prompt = selectionnerPromptAleatoire();
const openai = new OpenAI({
  apiKey: gptKey,
});
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    const reponse = completion.choices[0].message.content;

    sauvegarderReponse(JSON.stringify(reponse));
    sendEmail(reponse);
    return reponse;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'interrogation de l'API OpenAI:",
      error
    );
    throw error;
  }
}

app.get("/replay", async (req, res) => {
  try {
    await interrogerAPIOpenAI(); // Appeler la fonction interrogerAPIOpenAI
    res.send("Génération relancée avec succès !");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du rappel de la fonction interrogerAPIOpenAI :",
      error
    );
    res
      .status(500)
      .send("Erreur lors du rappel de la fonction interrogerAPIOpenAI.");
  }
});

app.get("/maj", async (req, res) => {
  try {
    await convertAutoToJs("./articlesAuto/", "./articles/");
    res.status(200).json({ message: "L'articles a été mis à jour avec succès" });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du chargement des articles :",
      error
    );
    res.status(500).json({ error: "Erreur lors de la mise à jour des articles" });
  }
});


app.get('/load', async (req, res) => {
  try {
    const articlesHTML = await loadArticles(); // Appel de la fonction pour charger les articles
    console.log(articlesHTML);
    res.status(200).send(articlesHTML); // Envoyer les articles HTML dans la réponse
  } catch (error) {
    console.error('Une erreur s\'est produite lors du chargement des articles :', error);
    res.status(500).send('Une erreur s\'est produite lors du chargement des articles');
  }
});

// Start server
https.createServer(options, app).listen(port, () => {
  console.log("Serveur HTTPS démarré sur le port 3000");
});
