class Joueur{
  constructor(scene,type){
    this.type = type;
    this.scene = scene;
    this.estCharge = false;
    this.image = new Image();
    this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
    this.image.src = Joueur.CONFIGURATION[this.type].SPRITESHEET;
  }

  creerSprite(evenementload){
    console.log("Image idle.png chargée");

    let spriteSheet = new createjs.SpriteSheet({
      images: [this.image],
      frames:{
        width:Joueur.CONFIGURATION[this.type].LARGEUR,
        height: Joueur.CONFIGURATION[this.type].HAUTEUR,
      },
      animations:{
        bouger:Joueur.CONFIGURATION[this.type].ANIMATION
      }
    });
    console.log("spriteSheet créée");
    this.sprite = new createjs.Sprite(spriteSheet,"bouger");
    this.sprite.scaleX = this.sprite.scaleY = 0.5;
    this.sprite.setBounds(
      this.sprite.x,
      this.sprite.y,
      Joueur.CONFIGURATION[this.type].LARGEUR* 0.5,
      Joueur.CONFIGURATION[this.type].HAUTEUR* 0.5);
    this.estCharge = true;
    console.log("sprite créée");
  }

  setPosition(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  afficher(){
    this.sprite.x = 200;
    this.sprite.y = 0;
    this.scene.addChild(this.sprite);
    console.log("sprite ajoutée à la scène");
  }

  avancer(){
    this.sprite.x = this.limiterMouvement(this.sprite.x + 10, this.sprite.y).x;
  }

  reculer(){
    this.sprite.x = this.limiterMouvement(this.sprite.x - 10, this.sprite.y).x;
  }

  monter(){
    this.sprite.y = this.limiterMouvement(this.sprite.x, this.sprite.y - 10).y;
  }

  descendre(){
    this.sprite.y = this.limiterMouvement(this.sprite.x, this.sprite.y + 10).y;
  }

  limiterMouvement(testX, testY){
    let nouveauX = testX;
    let nouveauY = testY;
    if(testX + this.sprite.getBounds().width > this.scene.largeur){
      nouveauX  = this.scene.largeur - this.sprite.getBounds().width;
    }else if(testX < 0){
      nouveauX = 0;
    }
    if(testY + this.sprite.getBounds().height > this.scene.hauteur){
      nouveauY  = this.scene.hauteur - this.sprite.getBounds().height;
    }else if(testY < 0){
      nouveauY = 0;
    }
    console.log("limiterMouvement {x: nouveauX, y: nouveauY}",{x: nouveauX, y: nouveauY});
    return {x: nouveauX, y: nouveauY};
  }

  getPosition(){
    return { x: this.sprite.x, y: this.sprite.y };
  }
}

Joueur.TYPE = {
  ROSE:"ROSE",
  BLEU:"BLEU"
}
Joueur.CONFIGURATION = {
  ROSE:{
    SPRITESHEET:"images/Walk.png",
    LARGEUR:416,
    HAUTEUR:454,
    ANIMATION: [0,1,2,3,4]
  },
  BLEU:{
    SPRITESHEET:"images/BoyWalk.png",
    LARGEUR:614,
    HAUTEUR:564,
    ANIMATION: [0,14]
  }
}
