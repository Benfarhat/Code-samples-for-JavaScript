
function afficheMessage (message, boite) {
  let msg = document.createElement('P')
  msg.innerHTML = message
  boite.appendChild(msg)
}

if ('BroadcastChannel' in window) { // Si broadcastChannel est supporté
  const channel1 = new BroadcastChannel('canal1') // on créé notre canal1 de broadcast

  const channel2 = new BroadcastChannel('canal2') // on créé notre canal2 de broadcast

  let envoyer1 = document.querySelector('button#btncanal1')
  let message1 = document.querySelector('input#inputcanal1')
  let boiteReception1 = document.querySelector('div#msgcanal1')

  let envoyer2 = document.querySelector('button#btncanal2')
  let message2 = document.querySelector('input#inputcanal2')
  let boiteReception2 = document.querySelector('div#msgcanal2')
  let pseudo = location.pathname

  if (envoyer1) {
    envoyer1.addEventListener('click', () => {
      // on envoi un message sur le canal1 (le page qui envoi ne recoit)
      channel1.postMessage(pseudo + ': ' + '<span>' + message1.value + '</span>')
      afficheMessage('Moi: ' + message1.value, boiteReception1)
      message1.value = ''
    }, false)

    // A la reception d'un message du canal1
    channel1.addEventListener('message', (e) => {
      afficheMessage(e.data, boiteReception1)
    }, false)
  }

  if (envoyer2) {
    envoyer2.addEventListener('click', () => {
      // on envoi un message sur le canal2
      channel2.postMessage(pseudo + ': ' + '<span>' + message2.value + '</span>')
      afficheMessage('Moi: ' + message2.value, boiteReception2)
      message2.value = ''
    }, false)

    // A la recpetion d'un message du canal2
    channel2.addEventListener('message', (e) => {
      afficheMessage(e.data, boiteReception2)
    }, false)
  }
} else {
  console.error("Broadcast Channel n'est pas supporté par votre navigateur")
}
