class Legume{
  constructor(scene,type){
    this.type = type;
    this.scene = scene;
    this.estCharge = false;
    this.estAffiche = false;
    this.image = new Image();
    this.image.addEventListener("load", evenementload => this.creerBitmap(evenementload));
    this.image.src = Legume.CONFIGURATION[this.type].IMAGE;
  }

  creerBitmap(evenementload){
    console.log("Image de legume");
    this.bitmap = new createjs.Bitmap(this.image);
    this.estCharge = true;
     // Assurez-vous que l'image est prête avant de tenter d'afficher le légume
    console.log("Bitmap de légume créée");
  }

  afficher(x, y){
    this.bitmap.x = x;
    this.bitmap.y = y;
    console.log("plantée à x:" + x + " y:" + y);
    this.scene.addChild(this.bitmap);
    this.estAffiche = true;
  }

  determinerRectangleOccupe() {
    return {
    x: this.bitmap.x,
    y: this.bitmap.y,
    largeur: 120,
    hauteur: 120
    };
  }

  mortLegume(){
   if (this.bitmap) {
    this.scene.removeChild(this.bitmap);
    this.bitmap = null;
    console.log("Le légume est mangé.");
   }
  }

}
Legume.TYPE = {
  RADIS:"RADIS",
  SALADE:"SALADE"
}
Legume.CONFIGURATION={
  RADIS:{
    IMAGE:"images/plante.png"
  },
  SALADE:{
    IMAGE:"images/salade.png"
  }
}
