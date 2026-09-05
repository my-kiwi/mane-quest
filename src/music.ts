/* eslint-disable */
// MINIFICATION NOTES:
// - No class: `this.foo` is a property access, and minifiers don't safely
//   rename plain property names, so every method/field on a class survives
//   minification at full length. Plain module-scope bindings below are
//   ordinary locals, which terser/rolldown DO rename freely (to `a`,`b`...).
// - `let` instead of `const` everywhere: "let" is 2 bytes shorter than
//   "const", and nothing here relies on reassignment being blocked.
// - Arrow functions (`let f = (x) => {...}`) instead of `function f(x){}`:
//   after minification, `let a=(b)=>{` is a couple bytes shorter per
//   declaration than `function a(b){`. Order doesn't matter even though
//   `let` isn't hoisted, because none of these run until called from
//   outside the module, by which point every top-level line has executed.
// - Track fields (st/mt/mv/...) and the arrangement letters ('f'/'b'/'d'/'o')
//   are plain object properties, so they're kept short by hand instead.
// - Notes are MIDI numbers instead of quoted names ('E4' -> 64): drops the
//   quote characters and replaces the name -> semitone table + regex
//   parser with a single arithmetic expression.

import { win } from "./dom-helpers";

type OscType = OscillatorType;
type TrackName = 'overworld' | 'platforming' | 'cavern';
// layer modes, kept to single chars since they're plain string data:
// f = full, b = noBass, d = noDrums, o = drumsOnly
type LayerMode = 'f' | 'b' | 'd' | 'o';

// Track fields are short (st/mt/mv/bt/bv/kk/sn/hh/sw/dt/fe/ar) for the same
// reason as LayerMode: they're object properties, not local variables.
interface Track {
  st: number;               // step duration, seconds
  mt: OscType;               // melody oscillator type
  mv: (number | null)[][]; // melody notes as MIDI numbers per variant (null = rest)
  bt: OscType;               // bass oscillator type
  bv: (number | null)[][]; // bass notes as MIDI numbers per variant
  kk: number[];              // kick steps
  sn: number[];              // snare steps
  hh: number[];              // hihat steps
  sw?: number;               // swing amount
  dt?: number;               // detune (cents)
  fe?: number;               // fill every N loops
  ar?: LayerMode[];          // arrangement, cycled once per loop; defaults to all 'f'
}

let R = null;

// MIDI -> frequency. Standard equal-temperament formula, A4 (69) = 440Hz.
let freq = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);

let tracks: Record<TrackName, Track> = {

  // 1) Overworld (note names, for reference: E4 G4 A4 G4 ... / bass C3 G2 A2 G2 ...)
  overworld: {
    st: 0.2,
    mt: 'triangle',
    mv: [
      [64, R, 67, 69, 67, R, 64, 62, 64, R, 67, 69, 72, R, 69, 67, 72, R, 71, 69, 67, R, 64, 62, 64, 62, 60, R, 62, 64, 62, R],
    ],
    bt: 'triangle',
    bv: [
      [48, R, 48, R, 43, R, 43, R, 45, R, 45, R, 43, R, 43, R, 48, R, 48, R, 43, R, 43, R, 41, R, 41, R, 43, R, 43, R],
      [48, R, 50, R, 52, R, 43, R, 45, R, 47, R, 48, R, 50, R, 48, R, 47, R, 45, R, 43, R, 41, R, 40, R, 38, R, 43, R],
    ],
    kk: [0, 8, 16, 24],
    sn: [4, 12, 20, 28],
    hh: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    sw: 0.12,
    fe: 4,
    ar: ['f', 'f', 'b', 'f', 'o', 'f', 'd', 'f'],
  },

  // 2) Platforming
  platforming: {
    st: 0.14,
    mt: 'square',
    mv: [
      [60, 64, 67, 64, 72, 67, 64, 67, 69, 72, 76, 72, 69, 67, 64, 67, 65, 69, 72, 69, 77, 72, 69, 72, 62, 65, 69, 72, 67, 64, 62, 60],
      [69, 72, 76, 72, 69, 64, 69, 72, 71, 74, 77, 74, 71, 69, 65, 69, 67, 71, 74, 71, 67, 64, 67, 71, 64, 69, 72, 76, 74, 71, 69, 64],
    ],
    bt: 'sawtooth',
    bv: [
      [48, 48, 43, 48, 48, 48, 43, 48, 41, 41, 48, 41, 41, 41, 48, 41, 43, 43, 50, 43, 43, 43, 50, 43, 48, 48, 43, 48, 43, 43, 48, 48],
      [45, 45, 40, 45, 45, 45, 40, 45, 41, 41, 48, 41, 41, 41, 48, 41, 43, 43, 50, 43, 43, 43, 50, 43, 40, 40, 45, 40, 45, 45, 40, 40],
    ],
    kk: [0, 4, 8, 12, 16, 20, 24, 28],
    sn: [4, 12, 20, 28],
    hh: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    sw: 0.08,
    fe: 4,
    ar: ['f', 'f', 'o', 'f', 'f', 'd', 'f', 'b'],
  },

  // 3) Cavern
  cavern: {
    st: 0.22,
    mt: 'sawtooth',
    mv: [
      [57, R, R, 60, R, R, 55, R, 57, R, R, 64, R, R, 60, R, 53, R, R, 57, R, R, 55, R, 52, R, 55, R, 53, R, 52, R],
      [60, R, R, R, 57, R, R, R, 55, R, R, R, 52, R, R, R, 50, R, R, R, 53, R, R, R, 52, R, R, 50, R, R, 48, R],
    ],
    bt: 'sine',
    bv: [
      [45, R, R, R, 45, R, R, R, 41, R, R, R, 41, R, R, R, 43, R, R, R, 43, R, R, R, 40, R, R, R, 40, R, R, R],
      [45, R, R, R, 43, R, R, R, 41, R, R, R, 40, R, R, R, 38, R, R, R, 41, R, R, R, 40, R, R, R, 36, R, R, R],
    ],
    kk: [0, 8, 16, 24],
    sn: [8, 24],
    hh: [0, 4, 8, 12, 16, 20, 24, 28],
    dt: -8,
    fe: 4,
    ar: ['f', 'd', 'f', 'b', 'o', 'f', 'd', 'f'],
  },
};

// ── engine state (module-scope locals, freely mangleable) ────
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let loopId = 0;
let current: TrackName | null = null;
let volume = 0.28;

let init = (): void => {
  if (ctx) return;
  let C = typeof win !== 'undefined' && (win.AudioContext || (win as any).webkitAudioContext);
  if (!C) return;
  ctx = new C();
  master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);
};

let fadeTo = (target: number, dur: number): void => {
  if (!master || !ctx) return;
  let now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(target, now + dur);
};

// ── shared envelope/noise helpers ─────────────────────────────
// attack -> sustain -> release (tonal notes/drones)
let sustainEnv = (g: GainNode, t0: number, dur: number, vol: number, attack: number, release: number): void => {
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.setValueAtTime(vol, Math.max(t0 + attack, t0 + dur - release));
  g.gain.linearRampToValueAtTime(0, t0 + dur);
};

// immediate hit -> exponential decay (percussion)
let expEnv = (g: GainNode, t0: number, vol: number, decay: number): void => {
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + decay);
};

// short linear attack -> exponential decay (bell partials)
let ad = (g: GainNode, t0: number, vol: number, attack: number, decay: number): void => {
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + attack + decay);
};

// white-noise burst; `taper` bakes a linear fade into the buffer itself
let noiseBuf = (dur: number, taper = false): AudioBufferSourceNode => {
  let n = Math.floor(ctx!.sampleRate * dur);
  let buf = ctx!.createBuffer(1, n, ctx!.sampleRate);
  let d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (taper ? 1 - i / n : 1);
  let src = ctx!.createBufferSource();
  src.buffer = buf;
  return src;
};
// ───────────────────────────────────────────────────────────────

let playNote = (freqHz: number, t0: number, dur: number, type: OscType, vol: number, detune = 0): void => {
  let o = ctx!.createOscillator();
  o.type = type; o.frequency.value = freqHz; o.detune.value = detune;
  let g = ctx!.createGain();
  sustainEnv(g, t0, dur, vol, 0.008, Math.min(0.15, dur * 0.5));
  o.connect(g); g.connect(master!);
  o.start(t0); o.stop(t0 + dur + 0.05);
};

let playKick = (t0: number, vol = 0.9): void => {
  let o = ctx!.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, t0);
  o.frequency.exponentialRampToValueAtTime(40, t0 + 0.1);
  let g = ctx!.createGain();
  expEnv(g, t0, vol, 0.22);
  o.connect(g); g.connect(master!);
  o.start(t0); o.stop(t0 + 0.25);
};

let playSnare = (t0: number, vol = 0.6): void => {
  let noise = noiseBuf(0.15, true);
  let nf = ctx!.createBiquadFilter();
  nf.type = 'highpass'; nf.frequency.value = 1000;
  let ng = ctx!.createGain();
  expEnv(ng, t0, vol, 0.13);
  noise.connect(nf); nf.connect(ng); ng.connect(master!);
  noise.start(t0);

  let tone = ctx!.createOscillator();
  tone.type = 'triangle'; tone.frequency.value = 180;
  let tg = ctx!.createGain();
  expEnv(tg, t0, vol * 0.5, 0.08);
  tone.connect(tg); tg.connect(master!);
  tone.start(t0); tone.stop(t0 + 0.1);
};

let playHihat = (t0: number, vol = 0.25): void => {
  let noise = noiseBuf(0.05);
  let f = ctx!.createBiquadFilter();
  f.type = 'highpass'; f.frequency.value = 7000;
  let g = ctx!.createGain();
  expEnv(g, t0, vol, 0.04);
  noise.connect(f); f.connect(g); g.connect(master!);
  noise.start(t0);
};

// Dark tolling bell for the death sting: sine partials at inharmonic
// ratios so it reads as metal, not a pure tone. Higher partials decay
// faster, giving the "shimmer then hollow out" character of a real bell.
let playBell = (freqHz: number, t0: number, dur: number, vol = 0.5): void =>
  ([[1, 1], [2.01, 0.55], [2.74, 0.32], [3.98, 0.18], [5.43, 0.1]] as [number, number][]).forEach(([ratio, g0], i) => {
    let decay = Math.max(0.3, dur * (1 - i * 0.15));
    let o = ctx!.createOscillator();
    o.type = 'sine'; o.frequency.value = freqHz * ratio;
    let g = ctx!.createGain();
    ad(g, t0, vol * g0, 0.02, decay);
    o.connect(g); g.connect(master!);
    o.start(t0); o.stop(t0 + decay + 0.1);
  });

// Low dissonant drone: two detuned sawtooths through a lowpass filter.
// Stack two a minor 2nd apart for that uneasy Souls-death-screen quality.
let playDrone = (freqHz: number, t0: number, dur: number, vol = 0.3): void =>
  [-4, 4].forEach((detune) => {
    let o = ctx!.createOscillator();
    o.type = 'sawtooth'; o.frequency.value = freqHz; o.detune.value = detune;
    let f = ctx!.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 400;
    let g = ctx!.createGain();
    sustainEnv(g, t0, dur, vol, 0.6, dur * 0.4);
    o.connect(f); f.connect(g); g.connect(master!);
    o.start(t0); o.stop(t0 + dur + 0.1);
  });

let scheduleLoop = (name: TrackName): void => {
  let t = tracks[name];
  let id = ++loopId;
  let stepsPerLoop = t.mv[0].length;
  let fillEvery = t.fe ?? 4;
  let arrangement = t.ar ?? ['f'];

  let stepIndex = 0;
  let loopCount = 0;
  let nextTime = ctx!.currentTime + 0.05;

  let tick = (): void => {
    if (id !== loopId) return;
    while (nextTime < ctx!.currentTime + 0.5) {
      let i = stepIndex % stepsPerLoop;
      if (i === 0 && stepIndex !== 0) loopCount++;

      let variant = loopCount % t.mv.length;
      let melody = t.mv[variant];
      let bass = t.bv[variant];
      let mode = arrangement[loopCount % arrangement.length];

      let isFillZone = (loopCount + 1) % fillEvery === 0 && i >= stepsPerLoop - 4 && mode !== 'd';
      let hitTime = nextTime + (t.sw && i % 2 === 1 ? t.st * t.sw : 0);

      let melodyOk = mode !== 'o';
      let bassOk = melodyOk && mode !== 'b';
      let drumsOk = mode !== 'd';

      let tryNote = (ok: boolean, arr: (number | null)[], type: OscType, durMult: number, vol: number): void => {
        let note = arr[i];
        if (ok && note !== null) playNote(freq(note), hitTime, t.st * durMult, type, vol, t.dt ?? 0);
      };
      tryNote(melodyOk, melody, t.mt, 0.85, 0.3);
      tryNote(bassOk, bass, t.bt, 1.4, 0.35);

      if (drumsOk) {
        if (isFillZone) {
          playSnare(hitTime, 0.5);
          if (i % 2 === 0) playKick(hitTime, 0.6);
        } else {
          if (t.kk.includes(i)) playKick(hitTime);
          if (t.sn.includes(i)) playSnare(hitTime);
          if (t.hh.includes(i)) playHihat(hitTime);
          else if (Math.random() < 0.08) playHihat(hitTime, 0.08);
        }
      }

      nextTime += t.st;
      stepIndex++;
    }
    setTimeout(tick, 100);
  };
  tick();
};

let play = (name: TrackName): void => {
  init();
  if (!ctx || !tracks[name]) return;
  if (ctx.state === 'suspended') ctx.resume();
  if (current === name) return;

  let fadeDur = 0.3;
  let start = (): void => {
    current = name;
    scheduleLoop(name);
    fadeTo(volume, fadeDur);
  };

  if (current !== null || loopId > 0) {
    // Fade the old track out first, then swap and fade the new one in.
    fadeTo(0, fadeDur);
    setTimeout(() => { stop(); start(); }, fadeDur * 1000);
  } else {
    master!.gain.value = 0;
    start();
  }
};

// Dark Souls / Elden Ring style "YOU DIED" sting: a low dissonant drone
// (root + minor 2nd, for dread) under a metallic tolling bell, with a
// fainter second toll near the end for closure. All synthesized, no
// samples. Fits inside a ~4s death screen, then goes silent — call
// play(...) again for the next level/retry.
let playDeathJingle = (): void => {
  init();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  if (current !== null || loopId > 0) stop();
  master!.gain.value = 0;
  current = null;
  fadeTo(volume, 0);

  let t0 = ctx.currentTime + 0.05;
  playDrone(freq(33), t0, 3.3, 0.28); // A1
  playDrone(freq(34), t0, 3.3, 0.14); // A#1
  playBell(freq(45), t0 + 0.1, 2.6, 1.5); // A2
  playBell(freq(40), t0 + 1.0, 1.5, 1.28); // E2
};

let stop = (): void => { loopId++; current = null; };

let setVolume = (v: number): void => { volume = v; if (master) master.gain.value = v; };

let getCurrentTrack = (): TrackName | null => current;

let Music = { play, playDeathJingle, stop, setVolume, getCurrentTrack };

// ── Usage ────────────────────────────────────────────────────
// Music.play('overworld');       // call on user's first input/click (autoplay policy)
// Music.play('platforming');     // crossfades automatically from whatever's playing
// Music.play('cavern');
// Music.playDeathJingle();       // ~3.5s dark bell + drone sting for the death screen
// Music.stop();
// Music.setVolume(0.2);

export default Music;
export type { TrackName };