var bs = document.querySelector('textarea#browser')
var tx = document.querySelector('textarea#simple')
var bm = document.querySelector('textarea#benchmark')
var info = document.querySelector('p#info')
var tSIMDStart, tSIMDEnd, tClassicStart, tClassicEnd
var n1, n2
var supportSIMD = false

const loadScript = url => {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.charset = 'utf8'
  script.src = url

  if (script.readyState) { // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        main()
      }
    }
  } else { // Others
    script.onload = function () {
      main()
    }
  }

  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script)
}

const main = () => {
  tx.textContent = 'Addition on Float32x4:\n'
  var a = SIMD.Float32x4(1, 2, 3, 4)
  tx.textContent += a.toString() + ' + '
  var b = SIMD.Float32x4(1, 4, 9, 16)
  tx.textContent += b.toString() + ' = '
  var ab = SIMD.Float32x4.add(a, b)
  tx.textContent += ab.toString() + '\n\n'

  tx.textContent += 'Multiplication on Int16x8:\n'
  var c = SIMD.Int16x8(1, 2, 3, 4, 5, 6, 7, 8)
  tx.textContent += c.toString() + ' x '
  var d = SIMD.Int16x8(1, 2, 3, 4, 5, 6, 7, 8)
  tx.textContent += d.toString() + ' = '
  var cd = SIMD.Int16x8.mul(c, d)
  tx.textContent += cd.toString() + '\n\n'

  var e = SIMD.Float32x4(1, 2, 3, 4)
  var f = SIMD.Float32x4(5, 6, 7, 8)
  tx.textContent += 'Shuffling on Float32x4:\n'
  tx.textContent += e.toString() + ' shuffle '
  tx.textContent += f.toString() + ' Shuffle index (1,2,3,4) =>\n'
  var shuffleEF = SIMD.Float32x4.shuffle(e, f, 1, 2, 3, 4)
  tx.textContent += shuffleEF.toString() + '\n\n'

  tx.textContent += "Shuffling on Float32x4 (it's like concating 2 array and return shuffle index (wich start from zero:\n"
  tx.textContent += e.toString() + ' shuffle '
  tx.textContent += f.toString() + ' Shuffle index (0,2,4,6) =>\n'
  shuffleEF = SIMD.Float32x4.shuffle(e, f, 0, 2, 4, 6)
  tx.textContent += shuffleEF.toString() + '\n\n'

  tx.textContent += 'Swizzling on Int16x8 (like shuffle for only one vector:\n'

  var g = SIMD.Int16x8(0, 1, 2, 3, 4, 5, 6, 7)
  tx.textContent += g.toString() + ' with swizzle index: 0,1,4,5,2,3,6,7 => \n'
  var swizzleG = SIMD.Int16x8.swizzle(g, 0, 1, 4, 5, 2, 3, 6, 7)
  tx.textContent += swizzleG.toString()

  /* Benchmarking */

  if (!supportSIMD) {
    bm.textContent += "Note that your browser didn't support SIMD - We will benchmark the polyfill instead!\n\n"
  }

  bm.textContent += '--------------------WITH RANDOM VALUE---------------------------\n\n' +
  'Executing 10000 additions with SIMD on random Float32x4:\n'
  tSIMDStart = performance.now()
  for (let i = 0; i < 10000; i++) {
    n1 = SIMD.Float32x4(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))
    n2 = SIMD.Float32x4(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10))
    SIMD.Float32x4.add(n1, n2)
  }
  tSIMDEnd = performance.now() - tSIMDStart

  bm.textContent += 'Finished after ' + tSIMDEnd + ' milliseconds:\n\n'

  bm.textContent += 'Executing 10000 x 4 (number of lane) additions of random scalar:\n'
  tClassicStart = performance.now()
  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 4; j++) {
      n1 = Math.floor(Math.random() * 10)
      n2 = Math.floor(Math.random() * 10)
      n1 += n2
    }
  }
  tClassicEnd = performance.now() - tClassicStart
  bm.textContent += 'Finished after ' + tClassicEnd +
  ' milliseconds:\n\n--------------------WITHOUT RANDOM VALUE---------------------------\n\n'

  bm.textContent += 'Executing 1000000 additions with SIMD on SIMD.Float32x4(1,2,3,4):\n'
  tSIMDStart = performance.now()
  n1 = SIMD.Float32x4(1, 2, 3, 4)
  n2 = SIMD.Float32x4(1, 2, 3, 4)
  for (let i = 0; i < 1000000; i++) {
    SIMD.Float32x4.add(n1, n2)
  }
  tSIMDEnd = performance.now() - tSIMDStart

  bm.textContent += 'Finished after ' + tSIMDEnd + ' milliseconds:\n\n'

  bm.textContent += 'Executing 1000000 x 4 (number of lane) additions of random scalar:\n'
  tClassicStart = performance.now()
  for (let i = 0; i < 1000000; i++) {
    for (let j = 1; j < 5; j++) {
      n1 = j
      n2 = j
      n1 += n2
    }
  }
  tClassicEnd = performance.now() - tClassicStart
  bm.textContent += 'Finished after ' + tClassicEnd + ' milliseconds:\n\n'
  bm.textContent += '................................................\n\n'

  bm.textContent += 'Executing 1000000 multiplications with SIMD on SIMD.Float32x4(1,2,3,4):\n'
  tSIMDStart = performance.now()
  n1 = SIMD.Float32x4(1, 2, 3, 4)
  n2 = SIMD.Float32x4(1, 2, 3, 4)
  for (let i = 0; i < 1000000; i++) {
    SIMD.Float32x4.mul(n1, n2)
  }
  tSIMDEnd = performance.now() - tSIMDStart

  bm.textContent += 'Finished after ' + tSIMDEnd + ' milliseconds:\n\n'

  bm.textContent += 'Executing 1000000 x 4 (number of lane) multiplications of random scalar:\n'
  tClassicStart = performance.now()
  for (let i = 0; i < 1000000; i++) {
    for (let j = 1; j < 5; j++) {
      n1 = j
      n2 = j
      n1 *= n2
    }
  }
  tClassicEnd = performance.now() - tClassicStart
  bm.textContent += 'Finished after ' + tClassicEnd + ' milliseconds:\n'

  /* Some SIMD Method Result on console */

  // ExtractLane
  console.log('Print value of ' + ab.toString())
  for (let i = 0; i < 4; i++) {
    console.log(i + ': ' + SIMD.Float32x4.extractLane(ab, i))
  }

  // Swizzle
  console.log('Reverse of ' + ab.toString() + ': ' + SIMD.Float32x4.swizzle(ab, 3, 2, 1, 0).toString())

  // load
  var tmp = new Int32Array([1, 2, 3, 4, 5, 6, 7, 8])
  console.log('Loading from ' + tmp.toString() + ' from index 2: ' + SIMD.Int32x4.load(tmp, 2).toString())

  // replaceLane
  tmp = SIMD.Float32x4(13, 54, 28, 34)
  console.log('Replacing from ' + tmp.toString() + ' index 2 to value 0: ' + SIMD.Float32x4.replaceLane(tmp, 2, 0).toString())

  // shiftLeftByScalar
  tmp = SIMD.Int16x8(1, 2, 3, 4, 5, 6, 7, 8)
  console.log('With ' + tmp.toString() + ' that give in binary:')
  for (let i = 0; i < 7; i++) {
    console.log(i + ': ' + SIMD.Int16x8.extractLane(tmp, i) + ' > ' + SIMD.Int16x8.extractLane(tmp, i).toString(2))
  }
  console.log('ShiftLeftByScalar of 1 bit give:')
  tmp = SIMD.Int16x8.shiftLeftByScalar(tmp, 1)
  for (let i = 0; i < 7; i++) {
    console.log(i + ': ' + SIMD.Int16x8.extractLane(tmp, i) + ' > ' + SIMD.Int16x8.extractLane(tmp, i).toString(2))
  }

  // Splat
  console.log('Create instance of Int16x8 where all lane have the same value (16 for example) ' + SIMD.Int16x8.splat(16).toString())

  // Equal and select
  a = SIMD.Float32x4(2, 5, 9, 7)
  b = SIMD.Float32x4(4, 5, 2, 7)
  console.log('Getting wich lane from ' + a.toString() + ' and ' + b.toString() + ' are equal:')
  var result = SIMD.Float32x4.equal(a, b)

  var zero = SIMD.Float32x4(0, 0, 0, 0)

  var finalResult = SIMD.Float32x4.select(result, a, zero)
  console.log(finalResult.toString())
}

if (typeof SIMD === 'undefined') {
  bs.textContent = 'SORRY! SIMD is not implemented in this browser. You should use another browser like Firefox nightly or Chromium build'
  bs.textContent += '\nLoading polyfill ecmascript_simd.js'
  info.style.display = 'block'
  bs.style.borderColor = '#c0392b'
  bm.style.borderColor = '#c0392b'
  loadScript('ecmascript_simd.js', main)
} else {
  bs.textContent = 'YES! SIMD is implemented in this browser!'
  bs.textContent += '\nNo need to load SIMD.js polyfill (ecmascript_simd.js)!'
  info.style.display = 'none'
  bs.style.borderColor = '#27ae60'
  bm.style.borderColor = '#27ae60'
  supportSIMD = true
  main()
}
