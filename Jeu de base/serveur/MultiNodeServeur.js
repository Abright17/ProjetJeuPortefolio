//Implementing URL Paths in NodeJs
//https://medium.com/@jstubblefield7939/implementing-url-paths-in-nodejs-fbf3d4e66592
//https://github.com/theturtle32/WebSocket-Node/blob/master/test/scripts/libwebsockets-test-server.js
//https://github.com/theturtle32/WebSocket-Node/blob/master/lib/WebSocketRouter.js
//https://github.com/theturtle32/WebSocket-Node/blob/master/test/scripts/libwebsockets-test-client.js

class Joueur{
  constructor(pseudonyme){
    this.pseudonyme = pseudonyme;
  }

  estSemblable(pseudonyme){
    return this.pseudonyme.indexOf(pseudonyme) >= 0;
  }
}

const http = require('http');
const websocket = require('websocket');

class MultiNodeServeur{
  constructor(){
    this.listeConnection = [];
    this.listeJoueur = [];

    //Message Multinode
    this.messageTransfertVariable            = {etiquette:"TRANSFERT_VARIABLE"};
    this.messageDemandeAuthentification      = {etiquette:"DEMANDE_AUTHENTIFICATION"};
    this.messageNotificationAuthentification = {etiquette:"NOTIFICATION_AUTHENTIFICATION"};
    this.messageNotificationVariable         = {etiquette:"NOTIFICATION_VARIABLE"};
    this.messageConfirmationAuthentification = {etiquette:"CONFIRMATION_AUTHENTIFICATION"};

    this.serveurHTTP = http.createServer();
    this.serveurHTTP.listen(8080);
    this.websocketServeur = new websocket.server({httpServer: this.serveurHTTP});
    this.websocketRouter = new websocket.router({server: this.websocketServeur});

    this.websocketRouter.mount('/multinode', null, (requete) => this.agirSurRequeteConnection(requete));
  }

  agirSurRequeteConnection(requete){
    let connection = requete.accept(requete.origin);
    this.listeConnection.push(connection);
    connection.on('message', (message) => this.agirSurReceptionMessage(message, connection));
    connection.on('close', (raison, description) => this.agirSurFermetureConnection(raison, description));
    connection.on('error', (erreur) => this.agirSurErreurConnection(erreur, connection));
  }

  agirSurReceptionMessage(message, connection){
    console.log(connection.remoteAddress + " message. type: " +message.type);
    if (message.type === 'utf8') {
      console.log("message.utf8Data : ",message.utf8Data);
      let messageMultinode = JSON.parse(message.utf8Data);
      switch(messageMultinode.etiquette) {
        case this.messageDemandeAuthentification.etiquette:
          this.repondreDemandeAuthentification(connection, messageMultinode);
          break;
        case this.messageTransfertVariable.etiquette:
          this.actionReceptionMessageTransfertVariable(messageMultinode);
          break;
      }

      this.actionFinReceptionMessage();
    }
  }

  actionReceptionMessageTransfertVariable(messageTransfertVariable){
    //TODO:Coder votre action
  }

  actionFinReceptionMessage(){
    //TODO:Coder votre action
  }

  actionCreerJoueur(pseudonyme){
    //TODO:Coder votre action
  }

  agirSurFermetureConnection(raison, description){
    console.log('Fermeture connection. Raison: ' + raison + ' Description ' + description);
  }

  agirSurErreurConnection(erreur, connection){
    console.log('Connection error for peer ' + connection.remoteAddress + ': ' + erreur);
  }

  repondreDemandeAuthentification(connection, messageDemandeAuthentification){
    console.log(messageDemandeAuthentification.etiquette);
    this.repondreConfirmationAuthentification(connection, messageDemandeAuthentification);
    this.ajouterJoueur(connection, messageDemandeAuthentification);
    this.repondreNotificationAuthentification(connection, messageDemandeAuthentification);
  }

  repondreConfirmationAuthentification(connection, messageDemandeAuthentification){
    this.messageConfirmationAuthentification.listePseudo = this.getListeAutrePseudonyme(messageDemandeAuthentification.pseudonyme);
    let reponse = JSON.stringify(this.messageConfirmationAuthentification);
    connection.send(reponse);
    console.log(reponse);
    this.messageConfirmationAuthentification.listePseudo = null;
  }

  ajouterJoueur(connection, messageDemandeAuthentification){
    let identifiantConnection = this.getIdentifiantConnection(connection);
    this.listeJoueur[identifiantConnection] = this.actionCreerJoueur(messageDemandeAuthentification.pseudonyme);
  }

  repondreNotificationAuthentification(connection, messageDemandeAuthentification){
    this.messageNotificationAuthentification.pseudonyme = messageDemandeAuthentification.pseudonyme;
    let reponse = JSON.stringify(this.messageNotificationAuthentification);
    console.log("#2 ------->",reponse);
    let identifiantConnection = this.getIdentifiantConnection(connection);
    this.listeConnection.forEach((connection, indexListeConnection) => {
      if(identifiantConnection != indexListeConnection){
        connection.send(reponse);
      }
    });
    this.messageNotificationAuthentification.pseudonyme = null;
  }

  getIdentifiantConnection(connection){
    return this.listeConnection.indexOf(connection);
  }

  repondreTransfertVariable(messageTransfertVariable){
    this.messageNotificationVariable.variable = messageTransfertVariable.variable;
    let reponse = JSON.stringify(this.messageNotificationVariable);
    console.log("repondreTransfertVariable : ", reponse);
    this.listeConnection.forEach((connection) => {connection.send(reponse);});
    this.messageNotificationVariable.variable = null;
  }

  getListeAutrePseudonyme(pseudonyme){
    let listePseudonyme = [];
    this.listeJoueur.forEach((joueur) => {
      if(!joueur.estSemblable(pseudonyme)){
        listePseudonyme[listePseudonyme.length] = joueur.pseudonyme;
      }
    });
    return listePseudonyme;
  }

}

module.exports = {
  Serveur : MultiNodeServeur,
  Joueur : Joueur
}
