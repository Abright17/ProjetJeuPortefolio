class ArrierePlan{
  constructor(scene){
    this.scene = scene;
    this.conteneur = new createjs.Container();


    this.estChargePaysage= false;
    this.shapePaysage = new createjs.Shape();
    this.matricePaysage= new createjs.Matrix2D();
    this.imagePaysage = new Image();
    this.imagePaysage.addEventListener("load", evenementloadpaysage => this.creerShapePaysage(evenementloadpaysage));
    this.imagePaysage.src = "images/background.png";


    this.estChargePaysageFeuilles = false;
    this.shapePaysageFeuilles = new createjs.Shape();
    this.matricePaysageFeuilles = new createjs.Matrix2D();
    this.imagePaysageFeuilles = new Image();
    this.imagePaysageFeuilles.addEventListener("load", evenementloadpaysageavant => this.creerShapePaysageFeuilles(evenementloadpaysageavant));
    this.imagePaysageFeuilles.src = "images/Feuilles1.png";

    this.offsetX = 0;
    this.offsetY = 0;

  }

  creerShapePaysage(evenementloadpaysage){
         let largeurFenetre = window.innerWidth;
         let hauteurFenetre = window.innerHeight;
         console.log("1359 993"+largeurFenetre, hauteurFenetre);

    this.shapePaysage.graphics.beginBitmapFill(this.imagePaysage, "repeat", this.matricePaysage).drawRect(0,0,1100,720).endStroke();
    this.estChargePaysage = true;
  }

creerShapePaysageFeuilles(evenementloadpaysageavant){
    this.shapePaysageFeuilles.graphics.beginBitmapFill(this.imagePaysageFeuilles, "repeat", this.matricePaysageFeuilles).drawRect(0,0,1100,800).endStroke();
    this.estChargePaysageFeuilles = true;
  }


  get estCharge(){
    return this.estChargePaysage && this.estChargePaysageFeuilles;
  }

  afficher(){
   this.conteneur.addChild(this.shapePaysage);
    this.conteneur.addChild(this.shapePaysageFeuilles);

   this.conteneur.scaleX = this.scene.largeur / 1100;
   this.conteneur.scaleY = this.scene.hauteur / 618;

   this.scene.addChild(this.conteneur);
  }
   /* defilerArrierePlan(joueurX, joueurY) {
    if (!this.estCharge) return;

    const vitesse = 5; // Vitesse du scrolling
    const margin = 200; // Distance avant que le scrolling commence

    // Vérifier la position du joueur par rapport au centre de l'écran
    let centreX = this.scene.largeur / 2;
    let centreY = this.scene.hauteur / 2;

    if (joueurX > centreX + margin) {
      this.offsetX -= vitesse; // Déplacer le fond à gauche
    } else if (joueurX < centreX - margin) {
      this.offsetX += vitesse; // Déplacer le fond à droite
    }

    if (joueurY > centreY + margin) {
      this.offsetY -= vitesse; // Déplacer le fond vers le haut
    } else if (joueurY < centreY - margin) {
      this.offsetY += vitesse; // Déplacer le fond vers le bas
    }

    // Appliquer les décalages au conteneur
    this.conteneur.x = this.offsetX;
    this.conteneur.y = this.offsetY;
  }*/
   animer(secondeEcoulee){
   let correctionVitesseRelative = 700 / this.scene.largeur;
   this.matricePaysage.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.PAYSAGE * secondeEcoulee * correctionVitesseRelative, 0);
   this.matricePaysageFeuilles.translate(-ArrierePlan.VITESSE_PIXEL_SECONDE.FEUILLES * secondeEcoulee * correctionVitesseRelative, 0);

  }
}
ArrierePlan.VITESSE_PIXEL_SECONDE = {
  PAYSAGE : 35,
  FEUILLES: 90
}
