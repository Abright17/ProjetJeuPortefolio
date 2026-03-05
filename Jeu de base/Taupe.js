class Taupe{
  constructor(scene){

    this.scene = scene;
    this.estCharge = false;
    this.image = new Image();
    this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
    this.image.src = "images/Unetaupe.png";
    this.vitesse = 10;  // Vitesse de la taupe
    this.legumes = []; // Liste de légumes à manger


    // Déplacer la taupe toutes les 2 secondes de manière aléatoire
   /*setInterval(() => {
    if (this.legumes.length > 0) {
        this.seDeplacerVersLegume(this.legumes);
    } else {
        this.apparaitreAleatoirement();
      }
}, 000);*/
  }

  creerSprite(evenementload){
    console.log("Image taupe.png chargée");

    let taupeSheetAttaque = new createjs.SpriteSheet({
      images: [this.image],

      frames:{
        width: 200,
        height: 160
      },

      animations:{
    attaquer: {
        frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
        next: "attaquer",
        speed: 0.1
    }
}

    });
    console.log("taupeSheetAttaque créée");

    this.taupeAttaque = new createjs.Sprite(taupeSheetAttaque,"attaquer");

    this.taupeAttaque.scaleX = this.taupeAttaque.scaleY = 0.5;

    this.taupeAttaque.setBounds(
      this.taupeAttaque.x,
      this.taupeAttaque.y,
      200 * 0.5,
      160 * 0.5);

    this.estCharge = true;
    console.log("taupeAttaque créée");

  }

    afficher() {
    this.apparaitreAleatoirement(); // Position aléatoire au départ
    this.scene.addChild(this.taupeAttaque);
  }

  apparaitreAleatoirement() {
     this.taupeAttaque.x = 400;
    this.taupeAttaque.y = 10;
   /*if (!this.estCharge || this.legumes.length > 0) return;

    let x = Math.random() * (this.scene.largeur - this.taupeAttaque.getBounds().width);
    let y = Math.random() * (this.scene.hauteur - this.taupeAttaque.getBounds().height);

    this.taupeAttaque.x = x;
    this.taupeAttaque.y = y;

    console.log(`Taupe apparaît à (${x}, ${y})`);*/
  }

  recevoirCoup() {
    this.nbCoups++;
    console.log(`La taupe a reçu ${this.nbCoups} coup(s)`);

    if (this.nbCoups >= 2) {
      this.mourir();
    }
  }
  determinerRectangleOccupe() {
    return {
        x: this.taupeAttaque.x,
        y: this.taupeAttaque.y,
        largeur: this.taupeAttaque.getBounds().width,
        hauteur: this.taupeAttaque.getBounds().height
    };
}
seDeplacerVersLegume(legumes) {
    if (!legumes) return;
   // console.log("seDeplacerVersLegume(legumes) legumes:", legumes);
    // Trouver le légume le plus proche
    let legumeCible = legumes.reduce((plusProche, legume) => {
        if(!plusProche) return legume;
        let distanceActuelle = this.calculerDistance(this.taupeAttaque, legume.bitmap);
        let distanceProche = this.calculerDistance(this.taupeAttaque, plusProche.bitmap);
        console.log("seDeplacerVersLegume(legumes) distanceActuelle: "+ distanceActuelle);
        console.log("seDeplacerVersLegume(legumes) distanceProche: "+ distanceProche);

        return distanceActuelle < distanceProche ? legume : plusProche;
    }, legumes[0]);
    if (!legumeCible) return;
    // Déplacer la taupe vers ce légume
    let vitesse = 1; // Ajustez la vitesse ici

    let dx = legumeCible.bitmap.x - this.taupeAttaque.x;
    let dy = legumeCible.bitmap.y - this.taupeAttaque.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > vitesse) {
        this.taupeAttaque.x += (dx / distance) * vitesse;
        this.taupeAttaque.y += (dy / distance) * vitesse;
    }
}

// Méthode pour calculer la distance entre deux objets
calculerDistance(objet1, objet2) {
    let dx = objet2.x - objet1.x;
    let dy = objet2.y - objet1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

}
