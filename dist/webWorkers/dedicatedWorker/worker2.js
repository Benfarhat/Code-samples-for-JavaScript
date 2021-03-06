var alphabet = 'aeiols'.split('')
var alphabetLeetSimple = '@€|07$'.split('')

onmessage = function (e) {
  // console.log('Message reçu de la part du script principal');
  // On simule une opération longue à s'exécuter (ici 500ms)
  setTimeout(
    function () {
      switch (e.data[0]) {
        case 'coucou':
          // on va juste envoyé une réponse sans se soucier
          // de ce qui a été envoyé
          postMessage('Message from worker 2: Hi Main script!')
          break
        case 'keyup':
          let l33t = e.data[1].split('')
            .map((x, i) => (
              alphabet.indexOf(x) < 0
                ? (i % 2 === 0
                  ? x.toUpperCase()
                  : x.toLowerCase())
                : alphabetLeetSimple[alphabet.indexOf(x)]))
            .join('')
          postMessage({'l33t': l33t})
          // console.log('Le résultat du traitement a été transmis')
          break
        default:
          console.log('Received message type not supported!')
      }
    },
    2500
  )
}
