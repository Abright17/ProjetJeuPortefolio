class App {
  constructor() {
    this.multiNode = new MultiNode();
    this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
    this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
    this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
    this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);

    this.listeJoueur = {};
    this.pseudonymeJoueur = "";
    this.pseudonymeAutreJoueur = "";

    this.formulaireAuthentification = document.getElementById("formulaire-authentification");
    this.formulaireAuthentification.addEventListener("submit", (e) => this.soumettreAuthentificationJoueur(e));
    this.champPseudonyme = document.getElementById("champ-pseudonyme");
    this.boutonAuthentification = document.getElementById("bouton-authentification");

    this.decorJeu = document.getElementById("dessin");
    this.decorJeu.style.display = "none";
    this.formulaireJeu = document.getElementById("formulaire-jeu");
    this.formulaireJeu.style.display = "none";

    this.champPointDeVie = document.getElementById("champ-point-de-vie");
    this.informationAutreJoueur = document.getElementById("information-autre-joueur");
    this.champPointDeVieAutreJoueur = document.getElementById("champ-point-de-vie-autre-joueur");

    this.TOUCHE_DROITE = 39;
    this.TOUCHE_GAUCHE = 37;
    this.TOUCHE_HAUT = 38;
    this.TOUCHE_BAS = 40;
    this.TOUCHE_PLANTER = 80;

    this.decorJeu.width = window.innerWidth;
    this.decorJeu.height = window.innerHeight;

    this.scene = new createjs.Stage(this.decorJeu);
    this.legumes = [];
    this.taupe = new Taupe(this.scene);
    this.arrierePlan = new ArrierePlan(this.scene);

    window.addEventListener("keydown", e => this.gererTouche(e));
    createjs.Ticker.addEventListener("tick", e => this.boucler(e));
    createjs.Ticker.setFPS(30);

    this.estCharge = false;
  }

  confirmerConnexion() {
    console.log("Je suis connecté.");
    this.pseudonymeJoueur = this.champPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  }

  confirmerAuthentification(autresParticipants) {
    console.log("Authentifié. Autres : ", autresParticipants);

    this.formulaireAuthentification.querySelector("fieldset").disabled = true;

    if (autresParticipants.length === 0) {
      this.ajouterJoueur(this.pseudonymeJoueur, "joueur");
    } else {
      this.ajouterJoueur(this.pseudonymeJoueur, "autre");
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(this.pseudonymeAutreJoueur, "joueur");
    }

    this.afficherPartie();
  }

  apprendreAuthentification(pseudonyme) {
    console.log("Nouveau joueur : " + pseudonyme);
    this.pseudonymeAutreJoueur = pseudonyme;
    this.ajouterJoueur(pseudonyme, "autre");
    this.afficherPartie();
  }

  ajouterJoueur(pseudonyme, type) {
    console.log("Ajout : " + pseudonyme + " → " + type);
    let instance;
    if (type === "joueur") {
      instance = new Joueur(this.scene);
    } else {
      instance = new AutreJoueur(this.scene);
    }
    this.listeJoueur[pseudonyme] = {
      pointDeVie: App.NOMBRE_POINT_DE_VIE,
      objet: instance
    };
  }

  afficherPartie() {
    this.decorJeu.style.display = "block";
    this.informationAutreJoueur.innerHTML =
      this.informationAutreJoueur.innerHTML.replace("{nom-autre-joueur}", this.pseudonymeAutreJoueur);
    this.champPointDeVieAutreJoueur.value = this.listeJoueur[this.pseudonymeAutreJoueur].pointDeVie;
    this.champPointDeVie.value = this.listeJoueur[this.pseudonymeJoueur].pointDeVie;
    this.formulaireJeu.style.display = "block";
    this.formulaireAuthentification.style.display = "none";
  }

  soumettreAuthentificationJoueur(e) {
    e.preventDefault();
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  changerPointdeVieJoueur(nouveau) {
    this.listeJoueur[this.pseudonymeJoueur].pointDeVie = nouveau;
    this.champPointDeVie.value = nouveau;
  }

  changerPointdeVieAutreJoueur(nouveau) {
    this.listeJoueur[this.pseudonymeAutreJoueur].pointDeVie = nouveau;
    this.champPointDeVieAutreJoueur.value = nouveau;
  }

  boucler(e) {
    if (!this.estCharge && this.taupe.estCharge && this.arrierePlan.estCharge) {
      let joueurObj = this.listeJoueur[this.pseudonymeJoueur]?.objet;
      let autreObj = this.listeJoueur[this.pseudonymeAutreJoueur]?.objet;

      if (joueurObj?.estCharge && autreObj?.estCharge) {
        this.arrierePlan.afficher();
        joueurObj.afficher();
        autreObj.afficher();
        this.taupe.afficher();
        this.estCharge = true;
      }
    }

    if (this.estCharge) {
      let seconde = e.delta / 1000;
      this.arrierePlan.animer(seconde);
      this.gererLegume();
      this.taupe.seDeplacerVersLegume(this.legumes);

      this.legumes = this.legumes.filter(legume => {
        if (this.testerCollisionRectangle(this.taupe.determinerRectangleOccupe(), legume.determinerRectangleOccupe())) {
          console.log("La taupe mange !");
          legume.mortLegume();
          return false;
        }
        return true;
      });
    }

    this.scene.update(e);
  }

  gererTouche(e) {
    let joueur = this.listeJoueur[this.pseudonymeJoueur]?.objet;
    if (!joueur) return;

    switch (e.keyCode) {
      case this.TOUCHE_DROITE: joueur.avancer(); break;
      case this.TOUCHE_GAUCHE: joueur.reculer(); break;
      case this.TOUCHE_HAUT: joueur.monter(); break;
      case this.TOUCHE_BAS: joueur.descendre(); break;
      case this.TOUCHE_PLANTER: this.planterLegume(); break;
    }
  }

  planterLegume() {
    let joueur = this.listeJoueur[this.pseudonymeJoueur]?.objet;
    if (!joueur) return;
    let pos = joueur.getPosition();
    let legume = new Legume(this.scene);
    this.legumes.push(legume);
    legume.image.addEventListener("load", () => legume.afficher(pos.x, pos.y));
  }

  gererLegume() {
    this.legumes.forEach(legume => {
      if (legume.estCharge && !legume.estAffiche) {
        legume.afficher(legume.bitmap.x, legume.bitmap.y);
      }
    });
  }

  testerCollisionRectangle(a, b) {
    return !(a.x >= b.x + b.largeur || a.x + a.largeur <= b.x ||
             a.y >= b.y + b.hauteur || a.y + a.hauteur <= b.y);
  }
}

App.NOMBRE_JOUEUR_REQUIS = 2;
App.NOMBRE_POINT_DE_VIE = 20;
App.MESSAGE = {
  PLANTER: "PLANTER",
  POINT_DE_VIE: "POINT_DE_VIE",
  FIN_PARTIE: "FIN_PARTIE"
};

new App();
