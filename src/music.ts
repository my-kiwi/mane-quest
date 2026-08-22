// ─────────────────────────────────────────────────────────────
// Procedural background music for js13k (no audio assets used)
// Pure Web Audio API oscillator synth + step sequencer.
// ~2-3KB minified. Drop in, call Music.play('overworld') etc.
// ─────────────────────────────────────────────────────────────

const Music = (() => {
  let ctx, master, running = false;
  let currentLoopId = 0;

  // Note name -> frequency (equal temperament, A4 = 440)
  const NOTE_FREQS = {};
  (() => {
    const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    for (let oct = 1; oct <= 7; oct++) {
      names.forEach((n, i) => {
        const midi = (oct + 1) * 12 + i;
        NOTE_FREQS[n + oct] = 440 * Math.pow(2, (midi - 69) / 12);
      });
    }
  })();

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.25;
    master.connect(ctx.destination);
  }

  // Simple ADSR-ish plucked/synth voice
  function playNote(freq, startTime, dur, type = 'triangle', vol = 1, detune = 0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;

    const attack = 0.015;
    const release = Math.min(0.25, dur * 0.6);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + attack);
    gain.gain.setValueAtTime(vol, startTime + dur - release);
    gain.gain.linearRampToValueAtTime(0, startTime + dur);

    osc.connect(gain);
    gain.connect(master);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  // Soft low sine pad for bass/harmony notes
  function playPad(freq, startTime, dur, vol = 0.5) {
    playNote(freq, startTime, dur, 'sine', vol);
  }

  // Light noise "tick" for percussion (no samples needed)
  function playTick(startTime, vol = 0.15) {
    const bufferSize = ctx.sampleRate * 0.03;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + 0.03);
    src.connect(gain);
    gain.connect(master);
    src.start(startTime);
  }

  // ── Track definitions ─────────────────────────────────────
  // Each track: tempo (step duration in seconds), melody (note or null per step),
  // bass (note or null per step, plays every N steps), percussion pattern, loop length.

  const tracks = {

    // 1) Overworld / Sage intro — gentle, naive, major key, waltz-ish
    overworld: {
      step: 0.28,
      melodyType: 'triangle',
      melody: [
        'E4', null, 'G4', null, 'A4', null, 'G4', null,
        'E4', null, 'D4', null, 'C4', null, null, null,
        'C4', null, 'E4', null, 'G4', null, 'E4', null,
        'D4', null, 'C4', null, null, null, null, null,
      ],
      bassEvery: 4,
      bass: ['C3', 'C3', 'G2', 'G2', 'A2', 'A2', 'G2', 'G2'],
      ticks: [0, 8, 16, 24], // sparse waltz pulse
    },

    // 2) Pre-trap platforming — bouncier, playful, slightly more forward motion
    platforming: {
      step: 0.18,
      melodyType: 'square',
      melody: [
        'C4', 'E4', 'G4', 'E4', 'C4', 'E4', 'G4', 'B4',
        'C5', 'B4', 'G4', 'E4', 'D4', 'F4', 'A4', 'F4',
        'D4', 'F4', 'A4', 'C5', 'D4', 'F4', 'A4', 'G4',
        'C4', 'E4', 'G4', 'E4', 'C4', null, null, null,
      ],
      bassEvery: 4,
      bass: ['C3', 'C3', 'F2', 'F2', 'G2', 'G2', 'C3', 'C3'],
      ticks: [0, 4, 8, 12, 16, 20, 24, 28],
    },

    // 3) Cavern — sparse, moody, minor, roomy (long notes + rests for "echo" feel)
    cavern: {
      step: 0.4,
      melodyType: 'sine',
      melody: [
        'A3', null, null, null, 'C4', null, null, null,
        'G3', null, null, null, 'E3', null, null, null,
        'F3', null, null, null, 'A3', null, null, null,
        'E3', null, null, null, null, null, null, null,
      ],
      bassEvery: 8,
      bass: ['A2', 'F2'],
      ticks: [0, 16], // very sparse, cavernous
      detune: -6, // subtle out-of-tune wobble for uneasy mood
    },
  };

  function scheduleLoop(name) {
    const t = tracks[name];
    const loopId = ++currentLoopId;
    const stepsPerLoop = t.melody.length;
    let stepIndex = 0;
    let nextTime = ctx.currentTime + 0.05;

    function scheduleAhead() {
      if (loopId !== currentLoopId) return; // stopped/switched
      while (nextTime < ctx.currentTime + 0.5) {
        const i = stepIndex % stepsPerLoop;
        const note = t.melody[i];
        if (note) {
          playNote(NOTE_FREQS[note], nextTime, t.step * 0.9, t.melodyType, 0.35, t.detune || 0);
        }
        if (i % t.bassEvery === 0) {
          const bassNote = t.bass[(i / t.bassEvery) % t.bass.length];
          if (bassNote) playPad(NOTE_FREQS[bassNote], nextTime, t.step * t.bassEvery * 0.95, 0.3);
        }
        if (t.ticks.includes(i)) {
          playTick(nextTime);
        }
        nextTime += t.step;
        stepIndex++;
      }
      setTimeout(scheduleAhead, 100);
    }
    scheduleAhead();
  }

  function play(name) {
    init();
    if (ctx.state === 'suspended') ctx.resume();
    if (!tracks[name]) return console.warn('Unknown track:', name);
    running = true;
    scheduleLoop(name);
  }

  function stop() {
    currentLoopId++; // invalidates any pending scheduleAhead loop
    running = false;
  }

  function setVolume(v) {
    if (master) master.gain.value = v;
  }

  return { play, stop, setVolume, init };
})();

// ── Usage ────────────────────────────────────────────────────
// Music.play('overworld');     // call on user's first input/click (autoplay policy)
// Music.play('platforming');   // switch when entering the platforming level
// Music.play('cavern');        // switch when Mike lands in the cavern
// Music.stop();                // silence
// Music.setVolume(0.15);       // 0..1

export default Music;