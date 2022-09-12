/*const express=require('express');
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

server.listen(8080);*/


//base de donnee
const express=require('express');
const path = require('path')
const pg = require('pg');
const panier=require('./Panier');
const livraison=require('./Livraison');
const pool = new pg.Pool({
   user: 'web',
   host: 'localhost',
   database: 'web',
   password: 1234,
   // accès à une information externe
   port: 5432
});

async function operations(requete) {
   const client = await pool.connect();
// attente du résultat de la requête :
   let res = await client.query (requete);
// chaque nom de colonne correspond à un nom de propriété de res :
   let tab= {};
   for(i in res.rows){
      tab[i]=res.rows[i];
   }
// libération du client :
   client.release();
// retour facultatif d'un résultat :
   return tab;
}
const main=express();
main.use(express.urlencoded({extended: true}));
main.set('views engine','ejs');
main.use(express.json());
main.use(express.static(path.join(__dirname, "public")));
/**--------------------pages----------------------------**/
main.get('/',(req, res)=>{
   res.status(200);
   res.render('produit/produit.ejs');
});

main.get('/acceuil',(req, res)=>{
   res.status(200);
   res.render('acceuil.ejs',{titre:["bonjour"]});
});

main.get('/produit',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM menu").then(produits=>{
      res.render('produit/produit.ejs',{produits,panier});
   });
});

main.post('/produit',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM menu").then(produits=>{
      res.render('produit/produit.ejs',{produits,panier});
   });
});

main.get('/connexion',(req, res)=>{
   res.status(200);
   res.render('connexion/connexion.ejs');
});

main.get('/inscription',(req, res)=>{
   res.status(200);
   res.render('connexion/inscription.ejs');
});

main.get('/livraison',(req, res)=>{
   res.status(200);
   res.render('livraison/livraison.ejs');
});

/**------------------------getteur----------------------------**/
main.get('/getProduits',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM menu").then(menus=>{
      res.json(menus);
   });
});
//entrees
main.get('/getEntree',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM entree").then(entrees=>{
      res.json(entrees);
   });
});
//menu
main.get('/getMenu',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM menu").then(menus=>{
      res.json(menus);
   });
});
//pizza
main.get('/getPizza',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM pizza").then(pizzas=>{
      res.json(pizzas);
   });
});
main.get('/getIngredient',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM ingredient").then(ingredients=>{
      res.json(ingredients);
   });
});
//boisson
main.get('/getBoisson',(req, res)=>{
   res.status(200);
   operations("SELECT nom,prix,id FROM boisson").then(boissons=>{
      res.json(boissons);
   });
});
//gestion panier
main.get('/getPanier',(req, res)=>{
   res.status(200);
   let list=panier.getPanier();
   let prix=panier.getPrix();
   let quantite=panier.getQuantite();
   res.json({list,prix,quantite});
});

main.get('/getSauce',(req, res)=>{
   res.status(200);
   operations("SELECT * FROM sauce").then(sauce=>{
      res.json(sauce);
   });
});

main.get('/getLivraison',(req, res)=>{
   res.status(200);
   res.json(livraison.getLivraison());

});

/**-------------------------actions------------------------------**/
main.get('/viderPanier',(req, res)=>{
   res.status(200);
   panier.vider();
   res.json("succes");
});

main.get('/removePanierElement',(req, res)=>{
   let id=req.query.id;
   panier.removeById(id);
   res.json("succes");
});

main.get('/addToPanier',(req, res)=>{//ajout un entree dans le panier
   res.status(200);
   panier.add(req.query.n,req.query.p,req.query.i,req.query.s,req.query.d);
   res.json("succes");
});

main.get('/addLivraison',(req, res)=>{
   livraison.addLivraison(req.query.client_nom,
       req.query.client_prenom,
       req.query.client_email,
       req.query.client_indic,
       req.query.client_adr_num,
       req.query.client_adr_nom,
       req.query.client_adr_ville,
       req.query.client_tel,
       panier.getPanier(),
       req.query.status);
   panier.vider();
   res.json("succes");
});

main.get('/changeStatusLivraison',(req, res)=>{
   livraison.setStatus(req.query.ID,req.query.status);
   res.json("succes");
});

main.post('/connexion',(req, res)=>{
   res.status(200);
   res.end("connexion test reussi");
});

main.post('/inscription',(req, res)=>{
   res.status(200);
   res.end("inscription test reussi");
});

main.listen(8080);
