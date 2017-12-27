var connections = 0 // on compte le nombre de connecté
var ports = [] // tableau qui contiendra les connexions vers qui le worker communiquera
// Simple générateur d'uid (un identifiant utilisé temporairement jusqu'a ce qu'on choisisse un pseudonyme)
function uid () {
  return 'xxxx-yy'.replace(/[x]/g, function (c) {
    return Math.random().toString(36).substr(2, 1).toUpperCase()
  }).replace(/[y]/g, function (c) {
    return Math.floor((Math.random() * 10)).toString()
  })
}

self.addEventListener('connect', function (e) { // ou : onconnect = function(e){
  var port = e.ports[0] // on recupére le connecté
  ports.push(port) // on l'ajoute à la liste des connexions
  connections++
  console.log(port)
  // on envoi à tout le monde le nouveau nombre de connection
  ports.forEach(function (p) {
    p.postMessage(['connection', connections])
  })
  // Selon le type de message
  port.onmessage = function (e) {
    console.log('Message reçu de la part du script principal')
    switch (e.data[0]) {
      case 'init': // initialisation on envoi un identifiant à seulement l'appelant
        port.postMessage(['register', uid()])
        console.log('Identifiant envoyé vers le script principal')
        break
      case 'chat': // on envoi le message vers toutes les connections
        ports.forEach(function (p) {
          p.postMessage(['chat', e.data[1] + ': ' + e.data[2]])
        })
        break
      default:
        console.log('type de message reçu non prise en charge')
    }
  }
  port.start()
})
