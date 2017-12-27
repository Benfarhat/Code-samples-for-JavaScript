var textarea = document.querySelector('#textarea')
const worker = new Worker('worker.js')
const length = 10

// Creating a shared buffer
// Int32Array.BYTES_PER_ELEMENT: Returns a number value of the element size. 4 in the case of an Int32Array.
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * length)

// Creating a data structure on top of that shared memory area
const sharedArray = new Int32Array(sharedBuffer)

for (let i = 0; i < length; i++) { sharedArray[i] = 2 ** i }

textarea.textContent += '* Main - Filling shared buffer with ' + length + ' numbers: \n'
textarea.textContent += '* Main - ' + sharedArray.toString() + '\n'
console.log(sharedArray)
/*
Int32Array [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 ]
buffer: SharedArrayBuffer { byteLength: 40 }
byteLength: 40
byteOffset: 0
length: 10
*/

// Send memory area to worker.js
worker.postMessage(sharedBuffer)

worker.onmessage = function (e) {
  textarea.textContent += e.data
}

setTimeout(function () {
  textarea.textContent += '* Main - Changing inside from Main script with Int32Array.prototype.reverse() method:' + '\n'
  sharedArray.reverse()

  textarea.textContent += '* Main - ' + sharedArray.toString() + '\n'
}, 2000)

setTimeout(function () {
  textarea.textContent += '* Main - Reading value from my side:' + '\n'

  textarea.textContent += '* Main - ' + sharedArray.toString() + '\n'
  textarea.textContent += '\n* Main - Values changed by Worker, not me :)'
}, 8000)
