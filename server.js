import express from "express";

const app = express();

// sert tout le dossier courant (html, css, js)
app.use(express.static("."));

// optionnel : page par défaut
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

app.listen(80, () => {
  console.log("Serveur lancé sur http://localhost/");
});