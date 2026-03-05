class App{
  constructor(){
    this.multiNode = new MultiNode();
    this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
    this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
    this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
    this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);
    this.listeJoueur = {};
    this.pseudonymeJoueur = "";
    this.pseudonymeAutreJoueur = "";
    this.formulaireAuthentification = document.getElementById("formulaire-authentification");
    this.formulaireAuthentification.addEventListener(
      "submit",
      (evenementsubmit) =>this.soumettreAuthentificationJoueur(evenementsubmit))
    this.champPseudonyme = document.getElementById("champ-pseudonyme");
    this.boutonAuthentification = document.getElementById("bouton-authentification");
    this.decorJeu = document.getElementById("dessin");
    this.decorJeu.style.display = "none";
    this.formulaireJeu = document.getElementById("formulaire-jeu");
    //this.formulaireJeu.addEventListener("submit", (evenementsubmit) => this.soumettreAttaque(evenementsubmit))
   file:///home/samuela/Documents/GitHub/projet-jeu-it-ration-serveur-2025-Abright17/Mon%20jeu/index.html this.formulaireJeu.style.display = "none";
    this.champPointDeVie = document.getElementById("champ-point-de-vie");
    //this.champAttaque = document.getElementById("champ-attaque");
    this.informationAutreJoueur = document.getElementById("information-autre-joueur");
     this.informationJoueur = document.getElementById("information-joueur");
    this.champPointDeVieAutreJoueur = document.getElementById("champ-point-de-vie-autre-joueur");
    this.joueurActuel = null;
    this.TOUCHE_DROITE = 39;
    this.TOUCHE_GAUCHE = 37;
    this.TOUCHE_HAUT = 38;
    this.TOUCHE_BAS = 40;
    this.TOUCHE_PLANTER = 80; // 'P' pour planter


    let dessin = document.getElementById("dessin");
    dessin.width = window.innerWidth;
    dessin.height = window.innerHeight;

    this.scene = new createjs.Stage(dessin);
    this.joueurRose = new Joueur(this.scene,Joueur.TYPE.ROSE);
    this.legumeRadis= new Legume(this.scene,Legume.TYPE.RADIS);
    this.legumeSalade= new Legume(this.scene,Legume.TYPE.SALADE);
    this.joueurBleu = new Joueur(this.scene,Joueur.TYPE.BLEU);
    this.legumesRose = [];
    this.legumesBleu = [];
    this.taupe = new Taupe(this.scene);
    this.arrierePlan = new ArrierePlan(this.scene);
    this.scene.largeur = dessin.width;
    this.scene.hauteur = dessin.height;
         //window.addEventListener("keydown", evenementkeydown => this.gererTouche(evenementkeydown));
    this.estCharge = false;
  }


  confirmerConnexion(){
    console.log("Je suis connecté.");
    //Le serveur nous confirme que nous sommes bien connecté, nous pouvons faire une demande d'authentification
    this.pseudonymeJoueur = this.champPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  }

  confirmerAuthentification(autresParticipants){
    console.log("Je suis authentifié.");
    console.log("Les autres participants sont " + JSON.stringify(autresParticipants));
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;
    if (autresParticipants.length === 0) {
      this.ajouterJoueur(this.pseudonymeJoueur, "joueur");
    } else {
      //this.ajouterJoueur(this.pseudonymeJoueur, "autre");
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(autresParticipants[0], "joueur");
      this.ajouterJoueur(this.pseudonymeJoueur, "autre");
      this.afficherPartie();
    }
  }

  apprendreAuthentification(pseudonyme){
    console.log("Nouvel ami " + pseudonyme);
    this.ajouterJoueur(pseudonyme,"autre");
    this.pseudonymeAutreJoueur = pseudonyme;
    this.afficherPartie();
  }

  ajouterJoueur(pseudonyme, type) {
    console.log("Ajout : " + pseudonyme + " → " + type);
    let instance;
    if (type === "joueur") {
      instance = this.joueurRose;
      console.log("FILLE: " + pseudonyme + " → " + type);
    } else {
      instance = this.joueurBleu;
      console.log("GARCON: " + pseudonyme + " → " + type);
    }
    this.listeJoueur[pseudonyme] = {
      pointLegume: App.NOMBRE_LEGUME_PLANTE,
      objet: instance
    };
  }

  recevoirVariable(variable) {
    console.log("recevoirVariable()");
    console.log("Surcharge de recevoirVariable " + variable.cle + " = " + variable.valeur);
    let message = JSON.parse(variable.valeur);
    if (message.pseudonyme !== this.pseudonymeJoueur) {
      switch (variable.cle) {
        case App.MESSAGE.DEPLACEMENT:
          this.deplacerAutreJoueur(message.touche);
          break;
        case App.MESSAGE.PLANTER:
          this.recevoirPlanterLegume(message.pseudonyme,message.x,message.y);
          break;
        case App.MESSAGE.TAUPE_MANGER_LEGUME:
          this.recevoirTaupeMangerLegume(message.pseudonyme,message.indexLegume);
          break;
        }
    }
    if(message.pseudonyme == this.pseudonymeJoueur){
      switch (variable.cle) {
        case App.MESSAGE.DEPLACEMENT:
          this.deplacerJoueur(message.touche);
          break;
        case App.MESSAGE.PLANTER:
          this.recevoirPlanterLegume(message.pseudonyme,message.x,message.y);
          break;
        case App.MESSAGE.TAUPE_MANGER_LEGUME:
           this.recevoirTaupeMangerLegume(message.pseudonyme,message.indexLegume);
           console.log("points perdus: " +  this.listeJoueur[this.pseudonymeJoueur].pointLegume);
      }
    }
  }

  afficherPartie(){
    this.decorJeu.style.display = "block";
    this.informationJoueur.innerHTML =
    this.informationJoueur.innerHTML.replace("{nom-joueur}", this.pseudonymeJoueur);
    this.informationAutreJoueur.innerHTML =
    this.informationAutreJoueur.innerHTML.replace("{nom-autre-joueur}", this.pseudonymeAutreJoueur);
    this.champPointDeVieAutreJoueur.value = this.listeJoueur[this.pseudonymeAutreJoueur].pointLegume;
    this.champPointDeVie.value = this.listeJoueur[this.pseudonymeJoueur].pointLegume;
    this.formulaireJeu.style.display = "block";
    this.formulaireAuthentification.style.display = "none";
      createjs.Ticker.addEventListener("tick", evenementtick => this.boucler(evenementtick));
         createjs.Ticker.setFPS(30);
  }

  soumettreAuthentificationJoueur(evenementsubmit){
    console.log("soumettreAuthentificationJoueur");
    evenementsubmit.preventDefault();
    //La demande de connexion au serveur est asynchrone, il faut attendre la réponse du serveur
    //pour faire une demande d'authentification
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  augmenterNombreLegumeJoueur(pseudonyme){
    console.log("changerNombreLegumeJoueur()=>valeur");
    let joueur= this.listeJoueur[pseudonyme]?.objet;
    this.listeJoueur[pseudonyme].pointLegume += 1;
     if (pseudonyme == this.pseudonymeJoueur){
      this.champPointDeVie.value =  this.listeJoueur[pseudonyme].pointLegume;
    }else{
      this.champPointDeVieAutreJoueur.value =  this.listeJoueur[pseudonyme].pointLegume;
    }
    let valeur = this.listeJoueur[pseudonyme].pointLegume;
  }

  perdreNombreLegumeJoueur(pseudonyme){
    console.log("changerNombreLegumeJoueur()=>valeur");
    let joueur= this.listeJoueur[pseudonyme]?.objet;
    this.listeJoueur[pseudonyme].pointLegume -= 1;
    if (pseudonyme == this.pseudonymeJoueur){
      this.champPointDeVie.value =  this.listeJoueur[pseudonyme].pointLegume;
    }else{
      console.log("recevoirTaupeMangerLegume JOUEUR-BLEU " +  this.listeJoueur[pseudonyme].pointLegume );
      this.champPointDeVieAutreJoueur.value =  this.listeJoueur[pseudonyme].pointLegume;
    }
  }

  boucler(evenementtick){
    if(!this.estCharge &&
       this.joueurRose.estCharge &&
       this.taupe.estCharge &&
       this.arrierePlan.estCharge &&
       this.joueurBleu.estCharge &&
       this.legumeRadis.estCharge &&
       this.legumeSalade.estCharge
       ){
      this.estCharge = true;
      this.arrierePlan.afficher();
      this.joueurRose.afficher();
      this.joueurBleu.afficher();
      this.taupe.afficher();
      window.addEventListener("keydown", evenementkeydown => this.gererTouche(evenementkeydown));
    }
    if(this.estCharge){
      //this.arrierePlan.defilerArrierePlan(this.joueur.getPosition().x, this.joueur.getPosition().y);
      let secondeEcoulee = evenementtick.delta/1000;
      this.arrierePlan.animer(secondeEcoulee);
      this.taupe.seDeplacerVersLegume(this.legumesRose.concat(this.legumesBleu));
      let legumes = [];
      // Crée un nouveau légume et l'affiche aux coordonnées du joueur
      if (this.listeJoueur[this.pseudonymeJoueur]?.objet.type == Joueur.TYPE.ROSE){
        legumes = this.legumesRose;
      }else{
        legumes = this.legumesBleu;
      }
      legumes.map(legume => {
        if (this.testerCollisionRectangle(this.taupe.determinerRectangleOccupe(), legume.determinerRectangleOccupe())) {
          console.log("La taupe a détecté un légume ! legumes.indexOf(legume)" + legumes.indexOf(legume));
          this.envoyerTaupeMangerLegume(legumes.indexOf(legume));
        }
      });
    }
    this.scene.update(evenementtick);
  }


  gererTouche(evenementkeydown){
    console.log("gererTouche : "+evenementkeydown.keyCode);
    if (!this.estCharge) return;
    let message = {
        pseudonyme : this.pseudonymeJoueur,
        touche: evenementkeydown.keyCode
    }
    if (message.touche == this.TOUCHE_PLANTER){
      this.envoyerPlanterLegume();
    }else{
      this.multiNode.posterVariableTextuelle (App.MESSAGE.DEPLACEMENT, JSON.stringify(message));
    }
  }

   deplacerJoueur(touche){
      let joueurActuel = this.listeJoueur[this.pseudonymeJoueur]?.objet;
      switch(touche){
      case this.TOUCHE_DROITE:
        joueurActuel.avancer();
        break;
      case this.TOUCHE_GAUCHE:
        joueurActuel.reculer();
        break;
      case this.TOUCHE_HAUT:
        joueurActuel.monter();
        break;
      case this.TOUCHE_BAS:
        joueurActuel.descendre();
        break;

    }
  }
  deplacerAutreJoueur(touche){
      let joueurActuel = this.listeJoueur[this.pseudonymeAutreJoueur]?.objet;
      switch(touche){
      case this.TOUCHE_DROITE:
        joueurActuel.avancer();
        break;
      case this.TOUCHE_GAUCHE:
        joueurActuel.reculer();
        break;
      case this.TOUCHE_HAUT:
        joueurActuel.monter();

        break;
      case this.TOUCHE_BAS:
        joueurActuel.descendre();
        break;

    }
  }

  envoyerPlanterLegume(){
    let joueurActuel = this.listeJoueur[this.pseudonymeJoueur]?.objet;
    let message = {
        pseudonyme : this.pseudonymeJoueur,
        x: joueurActuel.getPosition().x,
        y:joueurActuel.getPosition().y,
        valeur : this.listeJoueur[this.pseudonymeJoueur].pointLegume
      }
      this.multiNode.posterVariableTextuelle (App.MESSAGE.PLANTER, JSON.stringify(message));
  }

  recevoirPlanterLegume(pseudonyme,x,y){
    console.log("recevoirPlanterLegume(pseudonyme,x,y) x et y:", x , y );
    let joueur= this.listeJoueur[pseudonyme]?.objet;
    let nouveauLegume = null;
    // Crée un nouveau légume et l'affiche aux coordonnées du joueur
    if (joueur.type == Joueur.TYPE.ROSE){
      nouveauLegume = new Legume(this.scene,Legume.TYPE.RADIS);
      this.legumesRose.push(nouveauLegume);
    }else{
      nouveauLegume = new Legume(this.scene,Legume.TYPE.SALADE);
      this.legumesBleu.push(nouveauLegume);
    }
    setTimeout(() => { nouveauLegume.afficher(x,y);},1);
    this.augmenterNombreLegumeJoueur(pseudonyme);
  }

  envoyerTaupeMangerLegume(indexLegume){
    let message = {
      pseudonyme : this.pseudonymeJoueur,
      indexLegume: indexLegume
    }
    this.multiNode.posterVariableTextuelle (App.MESSAGE.TAUPE_MANGER_LEGUME, JSON.stringify(message));
  }

  recevoirTaupeMangerLegume(pseudonyme,indexLegume){
    console.log("recevoirTaupeMangerLegume" + pseudonyme + "indexLegume:"+ indexLegume);
    let joueur= this.listeJoueur[pseudonyme]?.objet;
    let legumeRetire = null;
    let legumes = [];
    // Crée un nouveau légume et l'affiche aux coordonnées du joueur
    if (joueur.type == Joueur.TYPE.ROSE){
      console.log("recevoirTaupeMangerLegume JOUEUR-ROSE" );
      legumes = this.legumesRose;
      legumeRetire = this.legumesRose[indexLegume];

    }else{
      console.log("recevoirTaupeMangerLegume JOUEUR-BLEU" );
      legumes = this.legumesBleu;
      legumeRetire = this.legumesBleu[indexLegume];
    }
    console.log("recevoirTaupeMangerLegume legumes:" + legumes  );
    console.log("recevoirTaupeMangerLegume legumeRetire:" + legumeRetire  );
    legumeRetire.mortLegume();
    delete legumes[indexLegume];
    this.perdreNombreLegumeJoueur(pseudonyme);

  }

  testerCollisionRectangle(rectangleA, rectangleB){
    if(rectangleA.x >= rectangleB.x + rectangleB.largeur ||rectangleA.x + rectangleA.largeur <= rectangleB.x ||
       rectangleA.y >= rectangleB.y + rectangleB.hauteur ||rectangleA.y + rectangleA.hauteur <= rectangleB.y){
      return false;
    }
    return true;
   }

}
App.NOMBRE_JOUEUR_REQUIS = 2;
App.NOMBRE_LEGUME_PLANTE = 0;
App.LEGUME_MAXIMUM = 5;
App.MESSAGE = {
    PLANTER: "PLANTER",
    DEPLACEMENT: "DEPLACEMENT",
    TAUPE_MANGER_LEGUME: "TAUPE_MANGER_LEGUME",
    FIN_PARTIE: "FIN_PARTIE",
};


new App();

