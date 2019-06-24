const resolutionWidth = screen.availWidth;
const windowMinWidth = 187;
const numWindows = Math.floor(resolutionWidth / windowMinWidth) + 1;
let colors = ['#EC5256', '#68E6FB', '#8DE79F', '#EEFA64', '#ECBA4E', '#EF793E', '#ff73de','#FFFFFF'];
let analyser, bufferLength, dataArray;
let allWindows = [];
let screenX, base;

window.onload = () => {
    const button = document.getElementsByTagName('button')[0];

    if(window.name === ""){
        base = window;

        button.onclick = () => {    
            for(var i = 0; i < numWindows; i++){
                allWindows.push(i);
                screenX = (i === 0) ? 0 : allWindows[i-1].screenX + windowMinWidth;
                allWindows[i] = window.open("popup.html", `window-left${i}`, `location=1,status=1,scrollbars=1,width=100,height=100,screenX=${screenX},screenY=0`);
                allWindows[i].document.writeln(`<body bgcolor='${colors[i]}'>`);
                allWindows[i].document.writeln("<\/body>");
                allWindows[i].document.close();
            }
            startSound();
        }
    } else {
        base = window.opener;
        for(var i = 0; i < allWindows.length; i++){
            allWindows[i] = base.allWindows[i];
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
    for(var i = 0; i < allWindows.length; i++){
        allWindows[i].close()
    }
    window.cancelAnimationFrame(draw);
}

const draw = () => {
    window.requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    let width;

    for(var i = 0; i < numWindows; i++){
        width = dataArray[i] * 1.5;
        allWindows[i].resizeTo(allWindows[i].outerWidth, width);
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
}