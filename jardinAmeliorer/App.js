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
    this.zoneAuth = document.getElementById("zone-auth");
    this.champPseudonyme = document.getElementById("champ-pseudonyme");
    this.boutonAuthentification = document.getElementById("bouton-authentification");

    this.formulaireJeu = document.getElementById("formulaire-jeu");
    this.decorJeu = document.getElementById("dessin");

    this.informationJoueur = document.getElementById("information-joueur");
    this.informationAutreJoueur = document.getElementById("information-autre-joueur");
    this.champPointDeVie = document.getElementById("champ-point-de-vie");
    this.champPointDeVieAutreJoueur = document.getElementById("champ-point-de-vie-autre-joueur");
    this.scoreJoueurAffichage = document.getElementById("score-joueur-affichage");
    this.scoreAutreJoueurAffichage = document.getElementById("score-autre-joueur-affichage");
    this.meilleurScoreAffichage = document.getElementById("meilleur-score");
    this.nbVictoiresAffichage = document.getElementById("nb-victoires");
    this.etatPartieAffichage = document.getElementById("etat-partie");
    this.etatBonusAffichage = document.getElementById("etat-bonus");
    this.messageCentral = document.getElementById("message-central");

    this.ecranFin = document.getElementById("ecran-fin");
    this.titreFin = document.getElementById("titre-fin");
    this.messageFin = document.getElementById("message-fin");
    this.resumeFin = document.getElementById("resume-fin");
    this.boutonRejouer = document.getElementById("bouton-rejouer");
    this.conteneurConfettis = document.getElementById("conteneur-confettis");

    this.formulaireAuthentification.addEventListener("submit", (e) => this.soumettreAuthentificationJoueur(e));
    this.boutonRejouer.addEventListener("click", () => window.location.reload());

    this.TOUCHE_DROITE = 39;
    this.TOUCHE_GAUCHE = 37;
    this.TOUCHE_HAUT = 38;
    this.TOUCHE_BAS = 40;
    this.TOUCHE_PLANTER = 80;

    this.partieTerminee = false;
    this.ecouteClavierAjoutee = false;
    this.estCharge = false;

    this.dernierePlantation = 0;
    this.cooldownPlantation = 400;

    this.tempsBonus = 0;
    this.bonusSoleil = null;

    this.statsLocal = this.chargerStatistiquesLocales();

    let dessin = document.getElementById("dessin");
    dessin.width = window.innerWidth;
    dessin.height = window.innerHeight;

    this.scene = new createjs.Stage(dessin);
    this.scene.largeur = dessin.width;
    this.scene.hauteur = dessin.height;

    this.joueurRose = new Joueur(this.scene, Joueur.TYPE.ROSE);
    this.joueurBleu = new Joueur(this.scene, Joueur.TYPE.BLEU);

    this.legumeRadis = new Legume(this.scene, Legume.TYPE.RADIS);
    this.legumeSalade = new Legume(this.scene, Legume.TYPE.SALADE);

    this.legumesRose = [];
    this.legumesBleu = [];

    this.taupe = new Taupe(this.scene);
    this.arrierePlan = new ArrierePlan(this.scene);

    this.decorJeu.style.display = "none";
    this.mettreAJourStatsLocalesAffichage();

    window.addEventListener("resize", () => this.redimensionnerJeu());
  }

  redimensionnerJeu() {
    const dessin = document.getElementById("dessin");
    dessin.width = window.innerWidth;
    dessin.height = window.innerHeight;
    this.scene.largeur = dessin.width;
    this.scene.hauteur = dessin.height;
  }

  chargerStatistiquesLocales() {
    try {
      const brut = localStorage.getItem(App.CLE_STATS);
      if (!brut) {
        return {
          meilleurScore: 0,
          nbVictoires: 0
        };
      }

      const data = JSON.parse(brut);
      return {
        meilleurScore: Number(data.meilleurScore) || 0,
        nbVictoires: Number(data.nbVictoires) || 0
      };
    } catch (e) {
      return {
        meilleurScore: 0,
        nbVictoires: 0
      };
    }
  }

  sauvegarderStatistiquesLocales() {
    localStorage.setItem(App.CLE_STATS, JSON.stringify(this.statsLocal));
  }

  mettreAJourStatsLocalesAffichage() {
    this.meilleurScoreAffichage.textContent = `Meilleur score : ${this.statsLocal.meilleurScore}`;
    this.nbVictoiresAffichage.textContent = `Victoires : ${this.statsLocal.nbVictoires}`;
  }

  afficherMessageCentral(texte) {
    if (!this.messageCentral) return;

    this.messageCentral.textContent = texte;
    this.messageCentral.style.display = "block";

    clearTimeout(this.messageCentralTimeout);
    this.messageCentralTimeout = setTimeout(() => {
      this.messageCentral.style.display = "none";
    }, 1500);
  }

  confirmerConnexion() {
    this.pseudonymeJoueur = this.champPseudonyme.value.trim();

    if (!this.pseudonymeJoueur) {
      alert("Entre un pseudonyme.");
      this.boutonAuthentification.disabled = false;
      return;
    }

    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  }

  confirmerAuthentification(autresParticipants) {
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;

    if (autresParticipants.length === 0) {
      this.ajouterJoueur(this.pseudonymeJoueur, "joueur");
      this.etatPartieAffichage.textContent = "État : en attente d’un autre joueur…";
    } else {
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(autresParticipants[0], "joueur");
      this.ajouterJoueur(this.pseudonymeJoueur, "autre");
      this.afficherPartie();
    }
  }

  apprendreAuthentification(pseudonyme) {
    this.ajouterJoueur(pseudonyme, "autre");
    this.pseudonymeAutreJoueur = pseudonyme;
    this.afficherPartie();
  }

  ajouterJoueur(pseudonyme, type) {
    let instance = null;

    if (type === "joueur") {
      instance = this.joueurRose;
    } else {
      instance = this.joueurBleu;
    }

    this.listeJoueur[pseudonyme] = {
      pointLegume: App.NOMBRE_LEGUME_PLANTE,
      objet: instance
    };
  }

  recevoirVariable(variable) {
    const message = JSON.parse(variable.valeur);

    switch (variable.cle) {
      case App.MESSAGE.DEPLACEMENT:
        if (message.pseudonyme === this.pseudonymeJoueur) {
          this.deplacerJoueur(message.touche);
        } else {
          this.deplacerAutreJoueur(message.touche);
        }
        break;

      case App.MESSAGE.PLANTER:
        this.recevoirPlanterLegume(message.pseudonyme, message.x, message.y);
        break;

      case App.MESSAGE.TAUPE_MANGER_LEGUME:
        this.recevoirTaupeMangerLegume(message.pseudonyme, message.indexLegume);
        break;

      case App.MESSAGE.FIN_PARTIE:
        this.terminerPartie(message.gagnant, message.perdant);
        break;
    }
  }

  afficherPartie() {
    this.decorJeu.style.display = "block";
    this.formulaireJeu.style.display = "block";
    this.zoneAuth.style.display = "none";

    this.informationJoueur.textContent = `Joueur : ${this.pseudonymeJoueur}`;
    this.informationAutreJoueur.textContent = `Adversaire : ${this.pseudonymeAutreJoueur || "en attente"}`;

    this.mettreAJourHUD();
    this.etatPartieAffichage.textContent = "État : partie en cours";
    this.etatBonusAffichage.textContent = "Bonus : aucun";

    createjs.Ticker.removeAllEventListeners("tick");
    createjs.Ticker.addEventListener("tick", (evenementtick) => this.boucler(evenementtick));
    createjs.Ticker.framerate = 30;
  }

  soumettreAuthentificationJoueur(evenementsubmit) {
    evenementsubmit.preventDefault();
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  mettreAJourHUD() {
    const scoreJoueur = this.listeJoueur[this.pseudonymeJoueur]?.pointLegume ?? 0;
    const scoreAutre = this.listeJoueur[this.pseudonymeAutreJoueur]?.pointLegume ?? 0;

    this.champPointDeVie.value = scoreJoueur;
    this.champPointDeVieAutreJoueur.value = scoreAutre;
    this.scoreJoueurAffichage.textContent = scoreJoueur;
    this.scoreAutreJoueurAffichage.textContent = scoreAutre;

    if (scoreJoueur > this.statsLocal.meilleurScore) {
      this.statsLocal.meilleurScore = scoreJoueur;
      this.sauvegarderStatistiquesLocales();
      this.mettreAJourStatsLocalesAffichage();
    }
  }



  boucler(evenementtick) {
    if (
      !this.estCharge &&
      this.joueurRose.estCharge &&
      this.joueurBleu.estCharge &&
      this.taupe.estCharge &&
      this.arrierePlan.estCharge &&
      this.legumeRadis.estCharge &&
      this.legumeSalade.estCharge
    ) {
      this.estCharge = true;
      this.arrierePlan.afficher();
      this.joueurRose.afficher();
      this.joueurBleu.afficher();
      this.taupe.afficher();

      if (!this.ecouteClavierAjoutee) {
        window.addEventListener("keydown", (evenementkeydown) => this.gererTouche(evenementkeydown));
        this.ecouteClavierAjoutee = true;
      }
    }

    if (this.estCharge && !this.partieTerminee) {
      let secondeEcoulee = evenementtick.delta / 1000;

      this.arrierePlan.animer(secondeEcoulee);
      this.mettreAJourBonus(secondeEcoulee);

      const legumesValides = this.obtenirTousLesLegumesValides();
      this.taupe.mettreAJourVitesse(legumesValides.length);
      this.taupe.seDeplacerVersLegume(legumesValides);

      const legumesDuJoueur = this.obtenirLegumesDuPseudonyme(this.pseudonymeJoueur);

      legumesDuJoueur.forEach((legume) => {
        if (!legume || !legume.bitmap) return;

        if (
          this.testerCollisionRectangle(
            this.taupe.determinerRectangleOccupe(),
            legume.determinerRectangleOccupe()
          )
        ) {
          const indexLegume = legumesDuJoueur.indexOf(legume);
          if (indexLegume !== -1) {
            this.envoyerTaupeMangerLegume(indexLegume);
          }
        }
      });
    }

    this.scene.update(evenementtick);
  }

  gererTouche(evenementkeydown) {
    if (!this.estCharge || this.partieTerminee) return;

    const message = {
      pseudonyme: this.pseudonymeJoueur,
      touche: evenementkeydown.keyCode
    };

    if (message.touche === this.TOUCHE_PLANTER) {
      this.envoyerPlanterLegume();
    } else {
      this.multiNode.posterVariableTextuelle(App.MESSAGE.DEPLACEMENT, JSON.stringify(message));
    }
  }

  deplacerJoueur(touche) {
    let joueurActuel = this.listeJoueur[this.pseudonymeJoueur]?.objet;
    if (!joueurActuel) return;

    switch (touche) {
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

  deplacerAutreJoueur(touche) {
    let joueurActuel = this.listeJoueur[this.pseudonymeAutreJoueur]?.objet;
    if (!joueurActuel) return;

    switch (touche) {
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

  envoyerPlanterLegume() {
    if (this.partieTerminee) return;

    const maintenant = Date.now();

    if (maintenant - this.dernierePlantation < this.cooldownPlantation) {
      this.afficherMessageCentral("Attends un peu avant de replanter");
      return;
    }

    const legumesJoueur = this.obtenirLegumesDuPseudonyme(this.pseudonymeJoueur);
    if (legumesJoueur.length >= App.LEGUME_MAXIMUM) {
      this.etatPartieAffichage.textContent = `État : limite de ${App.LEGUME_MAXIMUM} légumes atteinte`;
      this.afficherMessageCentral("Limite de légumes atteinte");
      return;
    }

    let joueurActuel = this.listeJoueur[this.pseudonymeJoueur]?.objet;
    if (!joueurActuel) return;

    this.dernierePlantation = maintenant;

    let message = {
      pseudonyme: this.pseudonymeJoueur,
      x: joueurActuel.getPosition().x,
      y: joueurActuel.getPosition().y
    };

    this.multiNode.posterVariableTextuelle(App.MESSAGE.PLANTER, JSON.stringify(message));
  }

  recevoirPlanterLegume(pseudonyme, x, y) {
    let joueur = this.listeJoueur[pseudonyme]?.objet;
    if (!joueur) return;

    const legumesActuels = this.obtenirLegumesDuPseudonyme(pseudonyme);
    if (legumesActuels.length >= App.LEGUME_MAXIMUM) return;

    let nouveauLegume = null;

    if (joueur.type === Joueur.TYPE.ROSE) {
      nouveauLegume = new Legume(this.scene, Legume.TYPE.RADIS);
      this.legumesRose.push(nouveauLegume);
    } else {
      nouveauLegume = new Legume(this.scene, Legume.TYPE.SALADE);
      this.legumesBleu.push(nouveauLegume);
    }

    setTimeout(() => {
      if (nouveauLegume && nouveauLegume.estCharge) {
        nouveauLegume.afficher(x, y);
      } else if (nouveauLegume) {
        const attente = setInterval(() => {
          if (nouveauLegume.estCharge) {
            nouveauLegume.afficher(x, y);
            clearInterval(attente);
          }
        }, 20);
      }
    }, 1);

    this.augmenterNombreLegumeJoueur(pseudonyme);
    this.etatPartieAffichage.textContent = "État : partie en cours";
  }

  envoyerTaupeMangerLegume(indexLegume) {
    if (this.partieTerminee) return;

    let message = {
      pseudonyme: this.pseudonymeJoueur,
      indexLegume: indexLegume
    };

    this.multiNode.posterVariableTextuelle(App.MESSAGE.TAUPE_MANGER_LEGUME, JSON.stringify(message));
  }

  recevoirTaupeMangerLegume(pseudonyme, indexLegume) {
    let joueur = this.listeJoueur[pseudonyme]?.objet;
    if (!joueur) return;

    let legumes = joueur.type === Joueur.TYPE.ROSE ? this.legumesRose : this.legumesBleu;
    let legumeRetire = legumes[indexLegume];

    if (!legumeRetire) return;

    this.taupe.jouerAnimationMorsure();

    legumeRetire.mortLegume();
    legumes.splice(indexLegume, 1);

    this.perdreNombreLegumeJoueur(pseudonyme);
    this.etatPartieAffichage.textContent = "État : la taupe a mangé un légume";
    this.afficherMessageCentral("La taupe a mangé un légume");
  }

  obtenirLegumesDuPseudonyme(pseudonyme) {
    const joueur = this.listeJoueur[pseudonyme]?.objet;
    if (!joueur) return [];

    if (joueur.type === Joueur.TYPE.ROSE) {
      return this.legumesRose.filter((legume) => legume && legume.bitmap);
    }

    return this.legumesBleu.filter((legume) => legume && legume.bitmap);
  }

  obtenirTousLesLegumesValides() {
    return this.legumesRose
      .concat(this.legumesBleu)
      .filter((legume) => legume && legume.bitmap);
  }

  creerBonusSoleil() {
    if (this.bonusSoleil || !this.estCharge || this.partieTerminee) return;

    this.bonusSoleil = new createjs.Shape();
    this.bonusSoleil.graphics
      .beginFill("#ffd43b")
      .drawCircle(0, 0, 20)
      .endFill();

    this.bonusSoleil.x = 120 + Math.random() * (this.scene.largeur - 240);
    this.bonusSoleil.y = 120 + Math.random() * (this.scene.hauteur - 240);
    this.bonusSoleil.alpha = 0.85;
    this.bonusSoleil.scaleX = 1;
    this.bonusSoleil.scaleY = 1;

    this.scene.addChild(this.bonusSoleil);

    createjs.Tween.removeTweens(this.bonusSoleil);
    createjs.Tween.get(this.bonusSoleil, { loop: true })
      .to({ scaleX: 1.25, scaleY: 1.25, alpha: 1 }, 450, createjs.Ease.sineInOut)
      .to({ scaleX: 1, scaleY: 1, alpha: 0.8 }, 450, createjs.Ease.sineInOut);

    this.etatBonusAffichage.textContent = "Bonus : soleil disponible";
    this.afficherMessageCentral("Un bonus soleil est apparu");
  }

  supprimerBonusSoleil() {
    if (!this.bonusSoleil) return;

    createjs.Tween.removeTweens(this.bonusSoleil);
    this.scene.removeChild(this.bonusSoleil);
    this.bonusSoleil = null;
    this.etatBonusAffichage.textContent = "Bonus : aucun";
  }

 mettreAJourBonus(secondeEcoulee) {
  if (this.partieTerminee) return;

  this.tempsBonus += secondeEcoulee;

  if (this.tempsBonus >= 30 && !this.bonusSoleil) {
    this.tempsBonus = 0;
    this.creerBonusSoleil();
  }

  if (!this.bonusSoleil) return;

  const joueurActuel = this.listeJoueur[this.pseudonymeJoueur]?.objet;
  if (!joueurActuel || !joueurActuel.sprite) return;

  const dx = joueurActuel.sprite.x - this.bonusSoleil.x;
  const dy = joueurActuel.sprite.y - this.bonusSoleil.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= 110) {
    this.augmenterNombreLegumeJoueur(this.pseudonymeJoueur);
    this.afficherMessageCentral("Bonus soleil : +1 légume");
    this.supprimerBonusSoleil();
    this.tempsBonus = 0;
    this.scene.update();
  }
}

 

  envoyerFinPartie(gagnant, perdant) {
    const message = { gagnant, perdant };
    this.multiNode.posterVariableTextuelle(App.MESSAGE.FIN_PARTIE, JSON.stringify(message));
  }

  terminerPartie(gagnant, perdant) {
    if (this.partieTerminee) return;

    this.partieTerminee = true;
    this.etatPartieAffichage.textContent = "État : partie terminée";
    this.supprimerBonusSoleil();

    const scoreJoueur = this.listeJoueur[this.pseudonymeJoueur]?.pointLegume ?? 0;
    const scoreAutre = this.listeJoueur[this.pseudonymeAutreJoueur]?.pointLegume ?? 0;

    const joueurGagne = gagnant === this.pseudonymeJoueur;

    if (joueurGagne) {
      this.titreFin.textContent = "Victoire";
      this.titreFin.className = "victoire bounce-titre";
      this.messageFin.textContent = `Bravo ${this.pseudonymeJoueur}, tu as gagné la partie.`;
      this.statsLocal.nbVictoires += 1;
      this.creerConfettisVictoire();
    } else {
      this.titreFin.textContent = "Défaite";
      this.titreFin.className = "defaite bounce-titre";
      this.messageFin.textContent = `Dommage, ${gagnant} a gagné cette partie.`;
    }

    this.statsLocal.meilleurScore = Math.max(this.statsLocal.meilleurScore, scoreJoueur);
    this.sauvegarderStatistiquesLocales();
    this.mettreAJourStatsLocalesAffichage();

    this.resumeFin.textContent =
      `Score final : ${this.pseudonymeJoueur} ${scoreJoueur} - ${this.pseudonymeAutreJoueur} ${scoreAutre}`;

    this.ecranFin.style.display = "flex";
  }

  testerCollisionRectangle(rectangleA, rectangleB) {
    if (
      rectangleA.x >= rectangleB.x + rectangleB.largeur ||
      rectangleA.x + rectangleA.largeur <= rectangleB.x ||
      rectangleA.y >= rectangleB.y + rectangleB.hauteur ||
      rectangleA.y + rectangleA.hauteur <= rectangleB.y
    ) {
      return false;
    }
    return true;
  }

  

App.NOMBRE_JOUEUR_REQUIS = 2;
App.NOMBRE_LEGUME_PLANTE = 0;
App.LEGUME_MAXIMUM = 5;
App.OBJECTIF_VICTOIRE = 5;
App.CLE_STATS = "jardin-multijoueur-stats";

App.MESSAGE = {
  PLANTER: "PLANTER",
  DEPLACEMENT: "DEPLACEMENT",
  TAUPE_MANGER_LEGUME: "TAUPE_MANGER_LEGUME",
  FIN_PARTIE: "FIN_PARTIE"
};

new App();
