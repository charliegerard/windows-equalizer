const resolutionHeight = screen.availHeight + 20;
const windowMinHeight = 163;
const windowMinWidth = 100;
let windowOne, windowTwo, windowThree, windowFour, windowFive, windowSix;
const numWindows = Math.floor(resolutionHeight / windowMinHeight);

let xCoordinateRightWindow = screen.availWidth - 163;

let analyser, freqs, bufferLength, dataArray;
// let allWindows = [];
let allLeftWindows = [];
let allRightWindows = [];
let screenY, screenX;
let base;

window.onload = () => {
    const button = document.getElementsByTagName('button')[0];

    if(window.name === ""){
        base = window;

        button.onclick = () => {
            // windowOne = window.open("windows/index1.html", "windowOne", "location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=0"); 
            // windowTwo = window.open("windows/index2.html", "windowTwo", `location=1,status=1,scrollbars=1,width=100,height=100,screenX=${screen.availWidth - 100},screenY=0`); 
            // windowThree = window.open("windows/index3.html", "windowThree", `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${windowTwo.screenY + windowMinHeight}`); 
            // windowFour = window.open("windows/index4.html", "windowFour", `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${windowThree.screenY + windowMinHeight}`); 
            // windowFive = window.open("windows/index5.html", "windowFive", `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${windowFour.screenY + windowMinHeight}`); 
            // windowSix = window.open("windows/index6.html", "windowSix", `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${windowFive.screenY + windowMinHeight}`); 
    
            for(var i = 0; i < numWindows; i++){
                allLeftWindows.push(i);
                allRightWindows.push(i);

                screenY = (i === 0) ? 0 : allLeftWindows[i-1].screenY + windowMinHeight;
    
                allLeftWindows[i] = window.open("windows/index1.html", `window-left${i}`, `location=1,status=1,scrollbars=1,width=100,height=100,screenX=0,screenY=${screenY}`);
                allRightWindows[i] = window.open("windows/index1.html", `window-right${i}`, `location=1,status=1,scrollbars=1,width=100,height=100,screenX=${xCoordinateRightWindow},screenY=${screenY}`);
            }
    
            startSound();
        }
    } else {
        base = window.opener;
        for(var i = 0; i < allLeftWindows.length; i++){
            allLeftWindows[i] = base.allLeftWindows[i];
        }
        for(var i = 0; i < allRightWindows.length; i++){
            allRightWindows[i] = base.allRightWindows[i];
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

const quit = () => {
    for(var i = 0; i < allLeftWindows.length; i++){
        allLeftWindows[i].close()
    }

    for(var i = 0; i < allRightWindows.length; i++){
        allRightWindows[i].close()
    }
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

            let screenY2 = (i === 0) ? 0 : allRightWindows[i-1].screenY + windowMinHeight;

            if(width < xCoordinateRightWindow){
                allRightWindows[i].moveTo(screen.availWidth - width, screenY2);
                allRightWindows[i].resizeTo(width, allRightWindows[i].outerHeight);
            } else {
                allRightWindows[i].moveTo(xCoordinateRightWindow, screenY2);
                allRightWindows[i].resizeTo(width, allRightWindows[i].outerHeight);
            }
        }
    }
}