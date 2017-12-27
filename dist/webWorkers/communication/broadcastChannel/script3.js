
if ('BroadcastChannel' in window) {
  const channel = new BroadcastChannel('canal2')
  let boiteReception = document.querySelector('div#msgcanal')

  channel.addEventListener('message', (e) => {
    let msg = document.createElement('P')
    msg.innerHTML = e.data
    boiteReception.appendChild(msg)
  }, false)
} else {
  console.error("Broadcast Channel n'est pas supporté par votre navigateur")
}
