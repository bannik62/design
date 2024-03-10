import { promises as fsPromises } from "fs";
import { createTransport } from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path"; // Retirez 'path' de cet import
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path"; // Assurez-vous d'inclure 'path' avec dirname et resolve

import dotenv from "dotenv";

dotenv.config();

const tokenMail  = process.env.DB_TOKENMAIL;



export async function loadArticles() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const folderPath = path.resolve(
      __dirname,
      "../../backBlog/serverBlog/articles"
    );

    // Liste des fichiers dans le dossier
    const files = await fsPromises.readdir(folderPath);

    let articlesHTML = "";

    // Pour chaque fichier
    for (const file of files) {
      // Vérifier si c'est un fichier JavaScript
      if (file.endsWith(".js") || file.endsWith(".txt") || file.endsWith(".html")) {
        const filePath = path.join(folderPath, file);
        // Lire le contenu du fichier
        const content = await fsPromises.readFile(filePath, "utf-8");
        
        // Utiliser une expression régulière pour extraire uniquement le contenu entre les balises <div class="article">
        const matches = content.match(/<div class="article">(.*?)<\/div>/gs);
        if (matches) {
          // Ajouter chaque correspondance au contenu HTML final en supprimant les guillemets supplémentaires
          articlesHTML += matches.map(match => match.replace(/"/g, "")).join("");
        }
      }
    }

    // Afficher le contenu nettoyé
    console.log("articles: " + articlesHTML);

    // Retourner la chaîne HTML contenant le contenu des articles
    return articlesHTML;
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du chargement des articles :",
      error
    );
    throw error;
  }
}

// Appel de la fonction pour charger et afficher les articles
loadArticles();
export async function sauvegarderReponse(reponse) {
  console.log("la reponse SAUVEGARDER " + reponse);

  function generateUniqueID() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ajoute un zéro devant si le mois est inférieur à 10
    const day = String(date.getDate()).padStart(2, "0"); // Ajoute un zéro devant si le jour est inférieur à 10
    const hours = String(date.getHours()).padStart(2, "0"); // Ajoute un zéro devant si l'heure est inférieure à 10
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Ajoute un zéro devant si les minutes sont inférieures à 10

    const uniqueID = `${year}${month}${day}_${hours}${minutes}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return uniqueID;
  }

  // Exemple d'utilisation
  const uniqueID = generateUniqueID();

  try {
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDirPath = dirname(currentFilePath);
    const cheminAbsolu = resolve(
      currentDirPath,
      `../../backBlog/serverBlog/articlesAuto/${uniqueID}_openaiAuto.txt`
    );

    // Vérifier si un fichier existe dans le dossier
    const files = await fsPromises.readdir(
      resolve(currentDirPath, `../../backBlog/serverBlog/articlesAuto/`)
    );
    for (const file of files) {
      if (file.endsWith(".txt")) {
        // Supprimer le fichier existant
        await fsPromises.unlink(
          resolve(
            currentDirPath,
            `../../backBlog/serverBlog/articlesAuto/${file}`
          )
        );
      }
    }

    // Écrire la chaîne dans le fichier
    await fsPromises.writeFile(cheminAbsolu, reponse);

    console.log(
      "Réponse authentifiée sauvegardée avec succès dans",
      cheminAbsolu
    );
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la sauvegarde de la réponse :",
      error
    );
    throw error;
  }
}

export async function sendEmail(reponse) {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "smtp62cent@gmail.com",
        pass: tokenMail,
      },
    });

    // Convertir l'objet en chaîne de caractères JSON
    const text = JSON.stringify(reponse);
    const htmlBody = `
        <p>Voici la réponse :</p>
        <pre>${text}</pre>
        <p>Vous pouvez valider l'article en cliquant sur ce <a href="https://codeurbase.fr:3000/maj">lien</a>.</p>
        <p>Si l'article ne convient pas, vous pouvez relancer la génération en cliquant sur ce <a href="https://codeurbase.fr:3000/replay">lien</a>.</p>
    `;

    const mailOptions = {
      from: "smtp62cent@gmail.com", // Adresse de l'expéditeur
      to: "djbk62@gmail.com", // Adresse du destinataire
      subject: `Generation d'article de blog `, // Objet de l'e-mail
      text: text, // Corps de l'e-mail
      html: htmlBody,
    };
    console.log(mailOptions);

    // Envoyer l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      } else {
        console.log("E-mail envoyé avec succès :", info.response);
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
  }
}

export async function convertAutoToJs(inputDir, outputDir) {
  try {
    // Lire les fichiers du répertoire d'entrée
    const files = await readdir(inputDir);

    // Filtrer les fichiers pour ne garder que les fichiers .txt
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    // Parcourir les fichiers .txt
    for (const file of txtFiles) {
      // Lire le contenu du fichier .txt
      const content = await readFile(resolve(inputDir, file), "utf-8");

      // Créer le nom du fichier de sortie avec l'extension .js
      const outputFile = file.replace(".txt", ".txt");

      // Créer le contenu du fichier .js avec le texte du fichier .txt
      const jsContent = JSON.stringify(content);

      // Écrire le contenu dans un fichier .js dans le répertoire de sortie
      await writeFile(resolve(outputDir, outputFile), jsContent);
    }

    console.log("Conversion des fichiers .txt en fichiers .js terminée.");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la conversion des fichiers :",
      error
    );
    throw error;
  }
}


// Exemple d'utilisation

export default { loadArticles, sauvegarderReponse, sendEmail, convertAutoToJs };
