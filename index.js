const resolutionHeight = screen.availHeight + 20;
const windowMinHeight = 163;
const windowMinWidth = 100;
let windowOne, windowTwo, windowThree, windowFour, windowFive, windowSix;
const numWindows = Math.floor(resolutionHeight / windowMinHeight);

let xCoordinateRightWindow = screen.availWidth - 163;
let colors = ['red', 'green', 'blue', 'white', 'grey', 'pink'];

let analyser, freqs, bufferLength, dataArray;
let allLeftWindows = [];
let screenY, screenX;
let base;

window.onload = () => {
    const button = document.getElementsByTagName('button')[0];

    if(window.name === ""){
        base = window;

        button.onclick = () => {    
            for(var i = 0; i < numWindows; i++){
                allLeftWindows.push(i);
                screenY = (i === 0) ? 0 : allLeftWindows[i-1].screenY + windowMinHeight;
                allLeftWindows[i] = window.open("windows/index1.html", `window-left${i}`, `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${screenY}`);
            }
            setColors();
            startSound();
        }
    } else {
        base = window.opener;
        for(var i = 0; i < allLeftWindows.length; i++){
            allLeftWindows[i] = base.allLeftWindows[i];
        }
    }   
    
    window.addEventListener('keydown', e => {
        switch(e.keyCode){
            case 81: // q
                quit();
                break;
            default:
                break;
        }
    })
} 

const setColors = () => {
    for(var i = 0; i < allLeftWindows.length; i++){
        allLeftWindows[i].document.body.style.backgroundColor = 'pink';
    }
}
const quit = () => {
    for(var i = 0; i < allLeftWindows.length; i++){
        allLeftWindows[i].close()
    }
    window.cancelAnimationFrame(draw);
}

const startSound = () => {
    let ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    let smoothing = 0.3;
    let source;

    const analyseAudio = () => {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
        } catch (e) {
            console.log('Web Audio API is not supported');
        }

        analyser.smoothingTimeConstant = smoothing;
        source = ctx.createBufferSource();
        
        var req = new XMLHttpRequest();
        let sound = document.getElementsByTagName('audio')[0].src;
        req.open('GET', sound, true);
        req.responseType = 'arraybuffer';

        req.addEventListener('load', function (event) {
            ctx.decodeAudioData(event.target.response, function (buffer) {
                source.buffer = buffer;
                source.start(0, 0);

                source.connect(analyser);
                analyser.connect(ctx.destination);
                analyser.fftSize = 256;

                bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                analyser.getByteTimeDomainData(dataArray);  
                draw()
            });
        });
        req.send();
    }

    analyseAudio();

    const draw = () => {
        window.requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        let width;

        for(var i = 0; i < numWindows; i++){
            width = dataArray[i] * 1.5;
            allLeftWindows[i].resizeTo(width, allLeftWindows[i].outerHeight);
        }
    }
}