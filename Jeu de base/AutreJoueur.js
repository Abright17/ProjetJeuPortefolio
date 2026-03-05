class AutreJoueur{
  constructor(scene){

    this.scene = scene;
    this.estCharge = false;
    this.image = new Image();
    this.image.addEventListener("load", evenementload => this.creerSprite(evenementload));
    this.image.src = "images/BoyWalk.png";
  }

  creerSprite(evenementload){
    console.log("Image idle.png chargée");

    let spriteSheetBoyIdle = new createjs.SpriteSheet({
      images: [this.image],

      frames:{
        width: 614,
        height: 564,

      },

      animations:{
        bouger: [0,14]
      }
    });
    console.log("spriteSheetBoyIdle créée");

    this.spriteBoy = new createjs.Sprite(spriteSheetBoyIdle,"bouger");

    this.spriteBoy.scaleX = this.spriteBoy.scaleY = 0.5;

    this.spriteBoy.setBounds(
      this.spriteBoy.x,
      this.spriteBoy.y,
      614* 0.5,
      564* 0.5);

    this.estCharge = true;
    console.log("spriteGarcon créée");

  }
  setPosition(x, y) {
  this.spriteBoy.x = x;
  this.spriteBoy.y = y;
  }

  afficher(){
    this.spriteBoy.x = 200;
    this.spriteBoy.y = 0;
    this.scene.addChild(this.spriteBoy);
    console.log("spriteGarcon ajoutée à la scène");

  }
  avancer(){

    this.spriteBoy.x = this.limiterMouvement(this.spriteBoy.x + 10, this.spriteBoy.y).x;
  }

  reculer(){

    this.spriteBoy.x = this.limiterMouvement(this.spriteBoy.x - 10, this.spriteBoy.y).x;
  }

  monter(){

    this.spriteBoy.y = this.limiterMouvement(this.spriteBoy.x, this.spriteBoy.y - 10).y;
  }

  descendre(){

    this.spriteBoy.y = this.limiterMouvement(this.spriteBoy.x, this.spriteBoy.y + 10).y;
  }

  limiterMouvement(testX, testY){
    let nouveauX = testX;
    let nouveauY = testY;

    if(testX + this.spriteBoy.getBounds().width > this.scene.largeur){
      nouveauX  = this.scene.largeur - this.spriteBoy.getBounds().width;
    }else if(testX < 0){
      nouveauX = 0;
    }

    if(testY + this.spriteBoy.getBounds().height > this.scene.hauteur){
      nouveauY  = this.scene.hauteur - this.spriteBoy.getBounds().height;
    }else if(testY < 0){
      nouveauY = 0;
    }

    console.log("limiterMouvement {x: nouveauX, y: nouveauY}",{x: nouveauX, y: nouveauY});
    return {x: nouveauX, y: nouveauY};

  }

  getPosition(){

        return { x: this.spriteBoy.x, y: this.spriteBoy.y };
    }

}
