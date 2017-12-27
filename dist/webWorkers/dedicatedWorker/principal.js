// selection de l'input et de l'élément d'affichage du résultat
var input = document.querySelector('#monInput')
var resultat1 = document.querySelector('#resultat1')
var resultat2 = document.querySelector('#resultat2')

if (window.Worker) { // Si l'API Web Worker est supporté
  // création du WebWorker
  var worker1 = new Worker('worker1.js')
  var worker2 = new Worker('worker2.js')

  // on envoi un message simple : dans mon cas la valeur [0]  du message envoyé
  // me renseigne de l'autre coté de quoi il s'agit.

  worker1.postMessage(['coucou', 'Salut Worker!'])
  worker2.postMessage(['coucou', 'Salut Worker!'])

  input.onkeyup = function () { // Si on modifie l'input
    worker1.postMessage(['keyup', input.value]) // on transmet le contenu
    worker2.postMessage(['keyup', input.value]) // on transmet le contenu
    // console.log("Contenu de l'input envoyé au worker");
  }

  // Si on recoit un message du worker
  worker1.onmessage = function (e) {
    if (typeof e.data === 'string') {
      // alert(e.data);
      console.log(e.data)
    } else {
      resultat1.textContent = e.data.reverse
    }
  }
  // Si on recoit un message du worker
  worker2.onmessage = function (e) {
    if (typeof e.data === 'string') {
      // alert(e.data);
      console.log(e.data)
    } else {
      resultat2.textContent = e.data.l33t
    }
  }
}
