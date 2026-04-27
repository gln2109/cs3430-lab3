let audioCtx;
let globalGain1;
let globalGain2;
let sirenLFO;
let fast = false;
let initialized = false;

document.addEventListener("DOMContentLoaded", function(event) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    globalGain1 = audioCtx.createGain();
    globalGain2 = audioCtx.createGain();
    globalGain1.gain.setValueAtTime(0, audioCtx.currentTime);
    globalGain2.gain.setValueAtTime(0, audioCtx.currentTime);
    globalGain1.connect(audioCtx.destination);
    globalGain2.connect(audioCtx.destination);

    sirenLFO = audioCtx.createOscillator();
    sirenLFO.frequency.value = 0.3;
})

function initSound1() {

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
    let brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    let lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 400;

    let lpf2 = audioCtx.createBiquadFilter();
    lpf2.type = 'lowpass';
    lpf2.frequency.value = 14;

    let hpf = audioCtx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.Q.value = 1/0.03;

    let bgain = audioCtx.createGain();
    bgain.gain.value = 0.1;

    let bgain2 = audioCtx.createGain();
    bgain2.gain.value = 400;

    let off = audioCtx.createConstantSource();
    off.offset.value = 500;

    brownNoise.connect(lpf);
    lpf.connect(hpf);
    hpf.connect(bgain);
    bgain.connect(globalGain1);

    brownNoise.connect(lpf2);
    lpf2.connect(bgain2);
    bgain2.connect(hpf.frequency);
    off.connect(hpf.frequency);

    off.start();
    brownNoise.start();
}

function initSound2() {

    let osc = audioCtx.createOscillator();
    osc.frequency.value = 700;

    let gain = audioCtx.createGain();
    gain.gain.value = 0.05;

    let lfo_gain = audioCtx.createGain();
    lfo_gain.gain.value = 300;

    let bpf = audioCtx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 1500;

    sirenLFO.connect(lfo_gain);
    lfo_gain.connect(osc.frequency);

    osc.connect(bpf);
    bpf.connect(gain);
    gain.connect(globalGain2);

    osc.start();
    sirenLFO.start();
}

function playSound1() {
    globalGain2.gain.setValueAtTime(0, audioCtx.currentTime);
    globalGain1.gain.setValueAtTime(1, audioCtx.currentTime);
    if(!initialized){
        initSound1();
        initSound2();
        initialized = true;
    }
}

function playSound2() {
    globalGain1.gain.setValueAtTime(0, audioCtx.currentTime);
    globalGain2.gain.setValueAtTime(1, audioCtx.currentTime);
    if(!initialized){
        initSound1();
        initSound2();
        initialized = true;
    }
}

function toggleSweep() {
    if(fast) {
        sirenLFO.frequency.value = 0.3;
        fast = false;
    } else {
        sirenLFO.frequency.value = 3;
        fast = true;
    }
}

function pauseSounds() {
    globalGain1.gain.setValueAtTime(0, audioCtx.currentTime);
    globalGain2.gain.setValueAtTime(0, audioCtx.currentTime);
}

