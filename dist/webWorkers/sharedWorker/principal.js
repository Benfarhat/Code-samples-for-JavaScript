// selection de l'input et de l'élément d'affichage du résultat
var pseudo = document.querySelector('#pseudo')
var message = document.querySelector('#message')
var textarea = document.querySelector('#textarea')
var identifiant = document.querySelector('#uid')
var connection = document.querySelector('#connection')
var pseudonyme, uid // un identifiant unique qui sera généré par le worker
var anonymous = 'Anonyme'
var debug = true // active ou désactive les console.log
window.addEventListener('load', iframeLoaded, false)

function iframeLoaded () {
  console.log(window)
  if (window.SharedWorker) { // Si l'API Web Worker est supporté
    // création du WebWorker
    var TacheDeFond = new SharedWorker('worker.js')
    // on initialise notre chat pour récupérer auprès du worker un identifiant unique
    TacheDeFond.port.postMessage(['init'])
    if (debug) console.log('initialisation du chat')
    pseudo.onkeyup = function () {
      // On assaini le contenu du peuso
      pseudo.value = pseudo.value.replace(/[^\d\w]/g, '')
      // On l'affecte à la variable pseudonyme
      pseudonyme = (pseudo.value === '') ? anonymous : pseudo.value
    }
    if (debug) {
      pseudo.onblur = function () {
        console.log(pseudonyme)
      }
    }
    message.onkeyup = function (e) {
      if (debug) console.log(e.keyCode)
      switch (e.keyCode) {
        case 27: // touche escape
          message.value = ''
          if (debug) console.log('message réinitialisé')
          break
        case 13: // touche entrée
          (pseudonyme === undefined) && (pseudonyme = anonymous)
          TacheDeFond.port.postMessage(['chat', pseudonyme, message.value])
          message.value = ''
          if (debug) console.log('message envoyé')
          break
      }
    }
    // Si on recoit un message du worker
    TacheDeFond.port.onmessage = function (e) {
      // console.clear()
      switch (e.data[0]) {
        case 'register': // si c'est un register on modifie les identifiants
          uid = e.data[1]
          identifiant.textContent = uid
          pseudo.value = uid
          pseudonyme = uid
          break
        case 'chat': // si c'est un chat on rempli notre textarea
          textarea.value += new Date().toTimeString().split(' ')[0] + '\t' + e.data[1] + '\n'
          break
        case 'connection':
          connection.textContent = e.data[1]
      }
      if (debug) console.log(e.data)
    }
  } else {
    console.log('Désolé, votre navigateur ne supporte pas les web workers')
    alert('Désolé, votre navigateur ne supporte pas les web workers')
  }
}
