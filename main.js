

let audioCtx;
function initBB() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

    lpf = audioCtx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 400;

    lpf2 = audioCtx.createBiquadFilter();
    lpf2.type = 'lowpass';
    lpf2.frequency.value = 14;

    hpf = audioCtx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.Q.value = 1/0.03;

    bgain = audioCtx.createGain();
    bgain.gain.value = 0.1;

    bgain2 = audioCtx.createGain();
    bgain2.gain.value = 400;

    off = audioCtx.createConstantSource();
    off.offset.value = 500;

    brownNoise.connect(lpf);
    lpf.connect(hpf);
    hpf.connect(bgain);
    bgain.connect(audioCtx.destination);

    brownNoise.connect(lpf2);
    lpf2.connect(bgain2);
    bgain2.connect(hpf.frequency);
    off.connect(hpf.frequency);

    off.start();
    brownNoise.start();
}


document.getElementById('play1').addEventListener('click', function () {
    if (!audioCtx) {
        initBB();
        return;
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }
}, false);

