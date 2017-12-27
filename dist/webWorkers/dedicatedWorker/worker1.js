onmessage = function (e) {
  // console.log('Message reçu de la part du script principal');
  // On simule une opération longue à s'exécuter (ici 500ms)
  setTimeout(
    function () {
      switch (e.data[0]) {
        case 'coucou':
          // on va juste envoyé une réponse sans se soucier
          // de ce qui a été envoyé
          postMessage('Message from worker 1: Hello Main script')
          break
        case 'keyup':
          let reverse = e.data[1].split('').reverse().join('')
          postMessage({'reverse': reverse})
          // console.log('Le résultat du traitement a été transmis')
          break
        default:
          console.log('Received message type not supported!')
      }
    },
    500
  )
}
