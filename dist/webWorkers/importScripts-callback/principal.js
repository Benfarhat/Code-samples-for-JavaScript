var textarea = document.querySelector('#textarea')
var url = document.querySelector('#url')
var button = document.querySelector('#importer')
var randomURL = [
  'https://api.fixer.io/latest',
  'http://api.icndb.com/jokes/random',
  'http://examples.kevinchisholm.com/utils/json/jsonp.php',
  'https://api.cdnjs.com/libraries/',
  'https://catalog.data.gov/api/3/action/package_search']
url.value = randomURL[Math.floor(Math.random() * (randomURL.length))]

if (window.Worker) {
  var worker = new Worker('worker.js')
  button.onclick = function (e) {
    e.preventDefault()
    if (url.value === '') {
      console.error('Please provide a valid JSON URL')
    } else {
      worker.postMessage(url.value)
    }
  }

  worker.onmessage = function (e) {
    textarea.textContent = e.data
  }
}
