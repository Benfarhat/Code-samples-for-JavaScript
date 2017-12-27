self.addEventListener('message', (e) => {
    // Create an Int32Array on top of that shared memory area
    const sharedArray = new Int32Array(e.data);

    //console.log('Message from Worker:') || 
    postMessage('\n\t> Worker - Received shared buffer:'+ '\n')
    postMessage('\t> '+ sharedArray.toString() + '\n\n');

    setTimeout(() => {
    	postMessage('\n\t> Worker - No change from me - Shared buffer values after 4 sec:\n\t> '+ sharedArray.toString() + '\n\n\t> Worker - Values changed by Main script, not me!');
    }, 4000)
    setTimeout(() => {
    	sharedArray.fill('0', 0, sharedArray.length)
    	postMessage("\n\n\t> Worker - It's my turn I modify all value to 0  - after 6 sec:\n\t> " + sharedArray.toString() + '\n\n');
    }, 6000)
});

