import bcrypt from 'bcrypt';

const saltRounds = 10; // Nombre de rounds de salage pour bcrypt
const password = 'bad';

bcrypt.hash(password , saltRounds, (err, hash) => {
  if (err) {
    console.error('Erreur lors de la génération du hash:', err);
  } else {
    console.log('Mot de passe haché:', hash);
    // Ici, tu peux stocker le hash dans une base de données ou l'utiliser comme nécessaire
  }
});
