import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import https from "https";
import fs from "fs";
import cors from "cors"; // Importez le middleware cors
import { sauvegarderReponseAuth } from "./modules/modulesJsAuth.mjs";
import { convertAuthToJs } from "./modules/modulesJsAuth.mjs";
import { sendEmailAuth } from "./modules/modulesJsAuth.mjs";
import dotenv from "dotenv";

dotenv.config();
const gptKey = process.env.DB_GPTKEY;

 const dbUser = process.env.DB_USER;
 const dbPass = process.env.DB_PASS;
 const secret = process.env.DB_SECRET;

const users = [
  {
    id: 1,
    username: dbUser ,
    passwordHash: dbPass,
  },
];
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/codeurbase.fr/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/codeurbase.fr/fullchain.pem"),
};

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Utilisez le middleware cors pour autoriser toutes les origines

const port = 3005;
const secretKeyToken = secret;

app.post("/login", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
console.log("user" + user);
  if (user) {
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (result) {
        const token = jwt.sign({ userId: user.id }, secretKeyToken, {
          expiresIn: "1h",
        });
        res.json({ token });
      } else {
        res.status(401).json({ message: "Identifiants invalides" });
      }
    });
  } else {
    res.status(401).json({ message: "Identifiants invalides" });
  }
});

app.post("/key", (req, res) => {
  const token = req.headers.authorization; // Récupérer le token depuis le header de la requête
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token.split(" ")[1], secretKeyToken, (err, decoded) => {
    // Extrait le token du format 'Bearer token'
    if (err) {
      return res.status(401).json({ message: "Token invalide" });
    } else {
      res.send("true"); // Envoyer "true" uniquement si le token est valide
    }
  });
});

app.get("/gpt", async (req, res) => {
  const { role, descriptif } = req.query;

  async function interrogerAPIOpenAIAuth(role, descriptif) {
    const openai = new OpenAI({
      apiKey:gptKey,
    });
    console.log("role " + role);
    console.log("descriptif" + descriptif);
    const prompt = `tu es un ${role}:   
    fait moi un article  ${ descriptif }
    il devra comporter un titre , une intro et faire mimimum 200 lignes 
    exemple :
    <h1>titre</h1>
    <H3>réumé intro alléchante</h3>
    - autant de <p>  que tu as besoins pour ecrire le texte.
    - utilise le plus de balises html que tu peus pour mettre en valeur le texte et les points fort de l'articles , ajoutes des sections...
    - je veut un SEO parfait pour le balisage html pour un référencement professionel 
    - évite  de mettres des saut de lignes \n met des <br> .
    -ne mets pas de caractéres d'échappement .
    - entoure moi le tous avec une div avec ayant la class article !
    - applique toi particulierement sur les balises HTML chaque balise ouvrantes devra avoir ca balise fermante 
      merci`;

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      const reponseAuth = completion.choices[0].message.content;

      console.log("log response auth ! :" + JSON.stringify(reponseAuth)); // Convertir l'objet en chaîne JSON pour l'afficher dans la console
      sauvegarderReponseAuth(JSON.stringify(reponseAuth));
      sendEmailAuth(reponseAuth);
      return reponseAuth;
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de l'interrogation de l'API OpenAI:",
        error
      );
      throw error;
    }
  }
  try {
    // Appeler la fonction interrogerAPIOpenAI avec les paramètres role et descriptif
    const reponseAuth = await interrogerAPIOpenAIAuth(role, descriptif);

    // Envoyer la réponse au client
    res.send(JSON.stringify(reponseAuth));
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de l'interrogation de l'API OpenAI:",
      error
    );
    res
      .status(500)
      .send(
        "Une erreur s'est produite lors de l'interrogation de l'API OpenAI."
      );
  }
});

app.get("/majAuth", async (req, res) => {
  try {
    await convertAuthToJs('../backBlog/serverBlog/articlesAuth/', '../backBlog/serverBlog/articles/');
    // Envoyer une réponse de succès avec un message simple indiquant que les articles ont été mis à jour
    res.send("<h1>Articles mis à jour avec succès !</h1>");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du chargement des articles :",
      error
    );
    // En cas d'erreur, envoyer une réponse avec le code d'erreur 500
    res.status(500).send("<h1>Erreur lors de la mise à jour des articles authentifiés</h1>");
  }
});



https.createServer(options, app).listen(port, () => {
  console.log("Serveur HTTPS démarré sur le port 3005");
});
