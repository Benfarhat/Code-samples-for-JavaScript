    var afficheMessage = document.querySelector('#afficheMessages');

    var iframe = document.querySelector('iframe');
    var otherWindow = iframe.contentWindow;
    var btnAchat = document.querySelector('#achat')
    var formAchat = document.querySelector('#paiement');
    var montantAchat = document.querySelector('#montant');
    montantAchat.value = Math.round(Math.random()*1000000)/1000;
    var initialisation = false; 

    var channel = new MessageChannel();
    /*
    Nous avons créé un canal de communication accessible via
    deux ports: MessageChannel.port1 et MessageChannel.port2
    Rappelez vous qu'il s'agit d'une communication entre thread
    Celui qui créée le canal écoute sur le port1 et envoi sur le port2
    l'autre écoute sur le port2 et envoi sur le port1

    */

    // otherWindow.postMessage("Starting communication", '*', [channel.port2]);

    /* 
    Si vous voulez attendre que l'iframe soit chargé (conseillé):

    iframe.addEventListener("load", iframeLoaded, false);
    function iframeLoaded() {
      otherWindow.postMessage("Init", '*', [channel.port2]);
    }

    */

    iframe.addEventListener("load", iframeLoaded, false);

    function iframeLoaded() {

      btnAchat.onclick = function(e) {
        e.preventDefault();
        var obj = {}
        for(var i = 0; i < formAchat.elements.length; i++){
         let element = formAchat.elements.item(i)
         if(element.name != ""){
          obj[element.name] = element.value
         }
        }


        /*
        La méthode postMessage prend comme premier argument le message et comme suite un Transferable

        "*" veut dire que le message sera envoyé vers n'importe quelle origine
        L'objet dont la proprieté (ownership) sera transféré au contexte du frame recepteur
        Ici on lui transfert channel.port2 pour qu'il puisse recevoir le message
        Mais on peut très bien transférer channel.port1 

        Imaginez que ce frame à deux combiné téléphonique, le A et le B, il garde le A
        Et envoi le B à l'autre frame pour qu'il puisse recevoir les messages qui lui sont destinés

        */
        // console.table(channel) // =>  port1 et port 2


        if(initialisation){ // Si l'initialisation a été faite on n'envoi plus le port pour l'autre côté
          otherWindow.postMessage(JSON.stringify(obj), '*');
        } else{ // Si initialisation pas faite (premier message) on envoi via l'attribut transferable, le port2
          otherWindow.postMessage(JSON.stringify(obj), '*', [channel.port2]);
          initialisation = true;
        }
        // On change le nouveau montant
        montantAchat.value = Math.round(Math.random()*1000000)/1000

      }


    };
    channel.port1.onmessage = handleMessage;

    function handleMessage(e) {
      afficheMessage.innerHTML = "Dernière transaction: " + e.data.transaction + " - total: " + e.data.montant + " €";
    } 


   channel.port1.onmessageerror = handleMessageError;

   function handleMessageError(e) {
    console.table("Erreur détectée. Détail de l'erreur:", e)
   };
