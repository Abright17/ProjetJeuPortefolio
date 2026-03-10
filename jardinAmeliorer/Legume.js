class Legume {
  constructor(scene, type) {
    this.type = type;
    this.scene = scene;
    this.estCharge = false;
    this.estAffiche = false;

    this.image = new Image();
    this.image.addEventListener("load", () => this.creerBitmap());
    this.image.src = Legume.CONFIGURATION[this.type].IMAGE;
  }

  creerBitmap() {
    this.bitmap = new createjs.Bitmap(this.image);
    this.bitmap.scaleX = 0.5;
    this.bitmap.scaleY = 0.5;
    this.estCharge = true;
  }

  afficher(x, y) {
    if (!this.bitmap) return;

    this.bitmap.x = x;
    this.bitmap.y = y;

    // Animation 1 : pop + rebond
    this.bitmap.scaleX = 0;
    this.bitmap.scaleY = 0;
    this.bitmap.alpha = 0;
    this.bitmap.rotation = -8;

    this.scene.addChild(this.bitmap);

    createjs.Tween.removeTweens(this.bitmap);
    createjs.Tween.get(this.bitmap)
      .to({ scaleX: 1.2, scaleY: 1.2, alpha: 1, rotation: 4 }, 160, createjs.Ease.backOut)
      .to({ scaleX: 0.85, scaleY: 0.85, rotation: -2 }, 110, createjs.Ease.quadOut)
      .to({ scaleX: 0.9, scaleY: 0.9, rotation: 0 }, 90, createjs.Ease.quadOut);

    this.estAffiche = true;
  }

  determinerRectangleOccupe() {
    if (!this.bitmap) {
      return { x: 0, y: 0, largeur: 0, hauteur: 0 };
    }

    return {
      x: this.bitmap.x,
      y: this.bitmap.y,
      largeur: 70,
      hauteur: 70
    };
  }

  mortLegume() {
    if (!this.bitmap) return;

    createjs.Tween.removeTweens(this.bitmap);
    createjs.Tween.get(this.bitmap)
      .to({ alpha: 0, scaleX: 0, scaleY: 0, rotation: 20 }, 160, createjs.Ease.quadIn)
      .call(() => {
        if (this.bitmap) {
          this.scene.removeChild(this.bitmap);
          this.bitmap = null;
          this.estAffiche = false;
        }
      });
  }
}

Legume.TYPE = {
  RADIS: "RADIS",
  SALADE: "SALADE"
};

Legume.CONFIGURATION = {
  RADIS: {
    IMAGE: "images/plante.png"
  },
  SALADE: {
    IMAGE: "images/salade.png"
  }
};
