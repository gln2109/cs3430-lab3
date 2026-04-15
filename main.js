

let audioCtx;
let globalGain;
document.addEventListener("DOMContentLoaded", function(event) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);
})


var bufferSize = 10 * audioCtx.sampleRate,
noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
output = noiseBuffer.getChannelData(0);
var lastOut = 0;
for (var i = 0; i < bufferSize; i++) {
    var brown = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * brown)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
}
brownNoise = audioCtx.createBufferSource();
brownNoise.buffer = noiseBuffer;
brownNoise.loop = true;
brownNoise.start(0);




lpf = audioCtx.createBiquadFilter();
lpf.type = 'lowpass';
lpf.frequency.value = 10;

hpf = audioCtx.createBiquadFilter();
hpf.type = 'highpass';
hpf.frequency.value = 10;



brownNoise.connect(lpf)
lpf.connect(hpf);
hpf.connect(globalGain);


//{RHPF.ar(LPF.ar(BrownNoise.ar(), 400), LPF.ar(BrownNoise.ar(), 14) * 400 + 500, 0.03, 0.1)}.play
