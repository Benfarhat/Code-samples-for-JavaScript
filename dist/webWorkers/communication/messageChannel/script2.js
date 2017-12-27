var listeAchat = document.querySelector('ol')
var total = document.querySelector('#total')
var port // variable pour récupérer le port qui lui est attribué par le script principal

// onmessage = function(e) {
self.addEventListener('message', function (e) { // ou  > onmessage = function(e) {
  var achat = JSON.parse(e.data)
  // console.clear()
  // console.table(achat) // Firefox affiche le nom déclaré plus loin
  var totalite = +total.textContent
  totalite = totalite + +achat.montant
  totalite = Math.round(totalite * 100) / 100
  total.textContent = totalite
  var itemAchat = document.createElement('li')
  if (achat.nom === '') achat.nom = 'Anonyme'
  // console.table(achat) // Chrome n'affiche le nom qu'après l'avoir affecté
  var dt = new Date()
  var date = (dt.getDate() < 10 ? '0' : '') + dt.getDate() + '/' + (dt.getMonth() < 9 ? '0' : '') + (+dt.getMonth() + 1) + '/' + dt.getFullYear() + ' ' + (dt.getHours() < 10 ? '0' : '') + dt.getHours() + ':' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes() + ':' + (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds()
  var contenu = date + ' - ' + achat.nom + ': ' + achat.montant + ' €'
  itemAchat.textContent = contenu
  listeAchat.appendChild(itemAchat)
  // e.port[0] est le channel.port2 envoye par le frame principal
  // quel que soit le port, nous devons le sauvegarder pour pouvoir répondre
  // pourquoi?
  // Parce que le script principal ne peut qu'au premier message envoyer par attribut transferable
  // le port, ensuite il ne l'envoi plus
  if (typeof port === 'undefined') {
    port = e.ports[0]
  }
  port.postMessage({'transaction': contenu, 'montant': totalite})
})
