class Taupe {
  constructor(scene) {
    this.scene = scene;
    this.estCharge = false;
    this.image = new Image();
    this.image.addEventListener("load", () => this.creerSprite());
    this.image.src = "images/Unetaupe.png";

    this.vitesse = 1;
    this.animationMorsureEnCours = false;
  }

  creerSprite() {
    let taupeSheetAttaque = new createjs.SpriteSheet({
      images: [this.image],
      frames: {
        width: 200,
        height: 160
      },
      animations: {
        attaquer: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          next: "attaquer",
          speed: 0.1
        }
      }
    });

    this.taupeAttaque = new createjs.Sprite(taupeSheetAttaque, "attaquer");
    this.taupeAttaque.scaleX = this.taupeAttaque.scaleY = 0.5;
    this.taupeAttaque.setBounds(
      this.taupeAttaque.x,
      this.taupeAttaque.y,
      200 * 0.5,
      160 * 0.5
    );

    this.estCharge = true;
  }

  afficher() {
    this.apparaitreAleatoirement();
    this.scene.addChild(this.taupeAttaque);
  }

  apparaitreAleatoirement() {
    this.taupeAttaque.x = 400;
    this.taupeAttaque.y = 10;
  }

  determinerRectangleOccupe() {
    return {
      x: this.taupeAttaque.x,
      y: this.taupeAttaque.y,
      largeur: this.taupeAttaque.getBounds().width,
      hauteur: this.taupeAttaque.getBounds().height
    };
  }

  mettreAJourVitesse(nombreLegumes) {
    this.vitesse = 1 + Math.min(nombreLegumes * 0.15, 2.5);
  }

  seDeplacerVersLegume(legumes) {
    if (!this.estCharge || !legumes || legumes.length === 0) return;

    const legumesValides = legumes.filter((legume) => legume && legume.bitmap);
    if (legumesValides.length === 0) return;

    let legumeCible = legumesValides.reduce((plusProche, legume) => {
      if (!plusProche) return legume;

      let distanceActuelle = this.calculerDistance(this.taupeAttaque, legume.bitmap);
      let distanceProche = this.calculerDistance(this.taupeAttaque, plusProche.bitmap);

      return distanceActuelle < distanceProche ? legume : plusProche;
    }, null);

    if (!legumeCible || !legumeCible.bitmap) return;

    let dx = legumeCible.bitmap.x - this.taupeAttaque.x;
    let dy = legumeCible.bitmap.y - this.taupeAttaque.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.vitesse) {
      this.taupeAttaque.x += (dx / distance) * this.vitesse;
      this.taupeAttaque.y += (dy / distance) * this.vitesse;
    }
  }

 jouerAnimationMorsure() {
  if (!this.taupeAttaque || this.animationMorsureEnCours) return;

  this.animationMorsureEnCours = true;

  const xInitial = this.taupeAttaque.x;
  const yInitial = this.taupeAttaque.y;

  createjs.Tween.removeTweens(this.taupeAttaque);

  createjs.Tween.get(this.taupeAttaque)
    .to({
      x: xInitial + 10,
      y: yInitial + 5,
      scaleX: 0.8,
      scaleY: 0.8,
      rotation: 10
    }, 100, createjs.Ease.quadOut)
    .to({
      x: xInitial,
      y: yInitial,
      scaleX: 0.5,
      scaleY: 0.5,
      rotation: 0
    }, 160, createjs.Ease.bounceOut)
    .call(() => {
      this.animationMorsureEnCours = false;
    });
}

  calculerDistance(objet1, objet2) {
    let dx = objet2.x - objet1.x;
    let dy = objet2.y - objet1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
