window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||             
                               window.msRequestAnimationFrame;

let windowSize = 100;
window.onload = () => {
    let currentX = 0;
    let currentY = 0;

    analyseAudio()

    window.addEventListener('keydown', (e) => {
        switch(e.keyCode){
            case 39: // right
                window.moveTo(currentX += windowSize, currentY);
                break;
            case 37: // left
                window.moveTo(currentX -= windowSize, currentY);
                break;
            case 40: // down
                window.moveTo(currentX, currentY += windowSize);
                break;
            case 38: // up
                window.resizeTo(500, 500);
                break;
            default:
                break;
        }   
    })
}

let ctx = new AudioContext();
let analyser = ctx.createAnalyser();
let smoothing = 0.3;
let numBands = 128;
let source;
let freqs;

let newSizeWindow;

const analyseAudio = () => {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
    } catch (e) {
        console.log('Web Audio API is not supported');
    }

    analyser.smoothingTimeConstant = smoothing;
    analyser.fftSize = numBands * 2;
    freqs = new Uint8Array(analyser.frequencyBinCount);
    source = ctx.createBufferSource();
    // source.buffer = buffer;
    // source.connect(analyser);
    // analyser.connect(ctx.destination);

    var req = new XMLHttpRequest();
    // req.open('GET', 'https://soundcloud.com/deadmau5isawesome/deadmau5-ghosts-n-stuff-1', true);
    req.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1715/the_xx_-_intro.mp3', true);
    req.responseType = 'arraybuffer';

    req.addEventListener('load', function(event) {
        ctx.decodeAudioData(event.target.response, function(buffer) {
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(ctx.destination);
            getData();
           
            // console.log(analyser.getByteFrequencyData(freqs))
            console.log(freqs)
            // return callback(buffer);
            source.start(0, 0);
        });
    });
    req.send();
}

const getData = () => {
    // console.log(freqs[Math.floor(Math.random() * 128)] / 256);
    analyser.getByteFrequencyData(freqs);
    // console.log(freqs);
    console.log(freqs[Math.floor(Math.random() * 128)] / 256 * 100);
    let vizFrequency = freqs[Math.floor(Math.random() * 128)] / 256 * 200;


    // window.resizeTo(windowSize + vizFrequency, windowSize + vizFrequency);
    window.resizeTo(windowSize + vizFrequency, 100);


    window.requestAnimationFrame(getData);
}
window.requestAnimationFrame(getData);