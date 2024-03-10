// console.log("helloyo");
//     const btnReq = document.querySelector(".btnReqcl");
//     console.log(btnReq);
     
//     btnReq.addEventListener("click", async () => {
//       const token = localStorage.getItem("codeurBaseToken")
    
//       if (token) {
//         console.log("token " + token);
//         try {
//           const response = await fetch("http://127.0.0.1:3005/key", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer ${token} ",
//             },
//           });
    
//           if (response.ok) {
//             const data = await response.json();
//             console.log("data from /key: ", data);
//             if (data === "true") {
//               // Le token est valide, maintenant effectuer la requête vers /articleGpt
//               try {
//                 const role = document.querySelector('input[name="role"]').value;
//                 const desciptif = document.querySelector('textarea[name="resume"]').value;
//                 const articleResponse = await fetch("http://127.0.0.1:3005/gpt", {
//                   method: "GET",
//                   headers: {
//                     "Content-Type": "application/json",
//                     Authorization: "Bearer ${token}",
//                   },
//                   body: JSON.stringify({ role, desciptif }), // Envoyer les données du formulaire
//                 });
    
//                 if (articleResponse.ok) {
//                   const articleData = await articleResponse.json();
//                   console.log("Réponse de la requête vers /articleGpt :", articleData);
//                   // Traitez la réponse de la requête vers /articleGpt ici
//                 } else {
//                   console.error(
//                     "Erreur lors de la requête vers /articleGpt :",
//                     articleResponse.statusText
//                   );
//                 }
//               } catch (error) {
//                 console.error("Erreur lors de la requête vers /articleGpt :", error);
//               }
//             } else {
//               console.log("Le token n'est pas valide.");
//             }
//           } else {
//             console.error("Erreur lors de la vérification du token :", response.statusText);
//           }
//         } catch (error) {
//           console.error("Erreur lors de la vérification du token :", error);
//         }
//       } else {
//         console.log("Pas de token disponible.");
//       }
//     });

  