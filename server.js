const express=require('express');
const path = require('path')
const fs=require('fs');
const server=express();
server.use(express.static("public"));
server.set('views engine','ejs');
server.use(express.json());
server.use(express.urlencoded({extended:false}));
//https://regbrain.com/article/bootstrap-express
server.use(express.static(path.join(__dirname, "public")));
server.get('/',(req,res)=>{
   res.status(400);
   res.render('acceuil.ejs',{titre:["bonjour"]});
});
server.get('/acceuil',(req,res)=>{
   res.status(400);
   res.render('acceuil.ejs',{titre:["bonjour"]});
});

server.get('/detail',(req,res)=>{
   res.status(400);
   let data=fs.readFileSync("plats.json","utf8");
   let produits=JSON.parse(data);
   console.log(produits["produits"]["produit1"]["nom"]);
   //res.render('produitList.ejs',{produits:["pizzasS","pizzasM","pizzasL"]});
   res.render('produitList/produitList.ejs',produits);
});
server.get('/connexion',(req,res)=>{
   res.status(400);
   res.render('connexion/connexion.ejs');
});
server.get('/inscription',(req,res)=>{
   res.status(400);
   res.render('connexion/inscription.ejs');
});

server.post('/connexion',(req,res)=>{
   console.log("connexion post");
   res.status(400);
   res.end("connexion test reussi");
});
server.post('/inscription',(req,res)=>{
   console.log("inscription post");
   res.status(400);
   res.end("inscription test reussi");
});

server.listen(8080);