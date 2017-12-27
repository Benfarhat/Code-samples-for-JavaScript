var textarea = document.querySelector('#textarea')
const worker = new Worker('worker.js')
const length = 10

// Creating a shared buffer
// Int32Array.BYTES_PER_ELEMENT: Returns a number value of the element size. 4 in the case of an Int32Array.
const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * length)

// Creating a data structure on top of that shared memory area
const sharedArray = new Int32Array(sharedBuffer)

for (let i = 0; i < length; i++) { Atomics.store(sharedArray, i, (2 ** i)) }

textarea.textContent += '* Main - Filling shared buffer with ' + length + ' numbers using Atomics.store(): \n'
textarea.textContent += '* Main - ' + sharedArray.toString() + '\n'

/*
var tmp = sharedArray[0];
while (tmp === 1);
*/
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
  textarea.textContent += '* Main - Changing inside from Main script with Atomics.store():' + '\n'
  for (let i = 0; i < length; i++) { Atomics.store(sharedArray, i, 2 ** (length - i - 1)) }
  // sharedArray.reverse()

  textarea.textContent += '* Main - ' + sharedArray.toString() + '\n'
}, 2000)

setTimeout(function () {
  textarea.textContent += '* Main - Reading value from my side:' + '\n'

  textarea.textContent += '* Main - ' + sharedArray.toString() + '\n\n* Main - Values changed by Worker, not me :)'
}, 15000)
