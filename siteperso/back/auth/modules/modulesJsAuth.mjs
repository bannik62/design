import { promises as fsPromises} from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { createTransport } from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// import path from 'path';

export async function sauvegarderReponseAuth(reponseAuth) {
    console.log("la reponse SAUVEGARDER " + reponseAuth);

    function generateUniqueID() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajoute un zéro devant si le mois est inférieur à 10
        const day = String(date.getDate()).padStart(2, '0'); // Ajoute un zéro devant si le jour est inférieur à 10
        const hours = String(date.getHours()).padStart(2, '0'); // Ajoute un zéro devant si l'heure est inférieure à 10
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Ajoute un zéro devant si les minutes sont inférieures à 10
    
        const uniqueID = `${year}${month}${day}_${hours}${minutes}_${Math.random().toString(36).substr(2, 9)}`;
    
        return uniqueID;
    }
    
    // Exemple d'utilisation
    const uniqueID = generateUniqueID();

    try {
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = dirname(currentFilePath);
        const cheminAbsolu = resolve(currentDirPath, `../../backBlog/serverBlog/articlesAuth/${uniqueID}_openaiAuth.txt`);

        // Vérifier si un fichier existe dans le dossier
        const files = await fsPromises.readdir(resolve(currentDirPath, `../../backBlog/serverBlog/articlesAuth/`));
        for (const file of files) {
            if (file.endsWith('.txt')) {
                // Supprimer le fichier existant
                await fsPromises.unlink(resolve(currentDirPath, `../../backBlog/serverBlog/articlesAuth/${file}`));
            }
        }

        // Écrire la chaîne dans le fichier
        await fsPromises.writeFile(cheminAbsolu, reponseAuth);

        console.log('Réponse authentifiée sauvegardée avec succès dans', cheminAbsolu);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la sauvegarde de la réponse :", error);
        throw error;
    }
}
// export async function loadArticlesAuth() {
//     const currentFilePath = fileURLToPath(import.meta.url);
//     const currentDirPath = dirname(currentFilePath);
//     const dossierArticles = path.join(currentDirPath, '../../backBlog/serverBlog/articles');

//     let articlesHTML = "";
    
//     try {
//       const files = await fsPromises.readdir(dossierArticles);
  
//       for (const file of files) {
//         const filePath = path.join(dossierArticles, file);
//         if (file.endsWith(".js")) {
//           const { default: articleModule } = await import(filePath);
//           articlesHTML += articleModule;
//         }
//       }
  
//       return articlesHTML;
//     } catch (error) {
//       console.error("Erreur lors du chargement des articles :", error);
//       throw error;
//     }
// }
export async function sendEmailAuth(reponse) {
    try {
        const transporter = createTransport({
            service: "gmail",
            auth: {
                user: "smtp62cent@gmail.com",
                pass: "exkhnktzusgnirkx"
            }
        });

        // Convertir l'objet en chaîne de caractères JSON
        const text = JSON.stringify(reponse);
        const htmlBody = `
        <p>Voici la réponse :</p>
        <pre>${text}</pre>
        <p>Vous pouvez valider l'article en cliquant sur ce <a href="https://codeurbase.fr:3005/majAuth">lien</a>.</p>
        <p>Si l'article ne convient pas, vous pouvez relancer la génération en cliquant sur ce <a href="https://codeurbase.fr:3000/replay">lien</a>.</p>
    `;

        const mailOptions = {
            from: 'smtp62cent@gmail.com', // Adresse de l'expéditeur
            to: 'djbk62@gmail.com', // Adresse du destinataire
            subject: `Generation d'article de blog `, // Objet de l'e-mail
            text: text, // Corps de l'e-mail
            html: htmlBody

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

export async function convertAuthToJs(inputDir, outputDir) {
    try {
        // Lire les fichiers du répertoire d'entrée
        const files = await fsPromises.readdir(inputDir);

        // Filtrer les fichiers pour ne garder que les fichiers .txt
        const txtFiles = files.filter(file => file.endsWith('.txt'));

        // Parcourir les fichiers .txt
        for (const file of txtFiles) {
            // Lire le contenu du fichier .txt
            const content = await fsPromises.readFile(resolve(inputDir, file), 'utf-8');

            // Supprimer les antislash suivis par 'n' et les transformer en saut de ligne
            const cleanedContent = content.replace(/\\n/g, '\n');

            // Encadrer le contenu dans des balises <div>
            const htmlContent = `<div class="article">${cleanedContent}</div>`;

            // Créer le nom du fichier de sortie avec l'extension .html
            const outputFile = file.replace('.txt', '.html');

            // Écrire le contenu dans un fichier .html dans le répertoire de sortie
            await fsPromises.writeFile(resolve(outputDir, outputFile), htmlContent);
            console.log(htmlContent);
        }

        console.log('Conversion des fichiers terminée.');
    } catch (error) {
        console.error('Une erreur est survenue lors de la conversion des fichiers :', error);
        throw error;
    }
}




export default { sauvegarderReponseAuth, sendEmailAuth, convertAuthToJs } 

{/* <div class="flou">

</div> */}
