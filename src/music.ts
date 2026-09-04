/* eslint-disable */

type OscType = OscillatorType;
type TrackName = 'overworld' | 'platforming' | 'cavern';
type LayerMode = 'full' | 'noBass' | 'noDrums' | 'drumsOnly';

interface Track {
  step: number;
  melodyType: OscType;
  melodyVariants: (string | null)[][];
  bassType: OscType;
  bassVariants: (string | null)[][];
  kick: number[];
  snare: number[];
  hihat: number[];
  swing?: number;
  detune?: number;
  fillEvery?: number;
  arrangement?: LayerMode[]; // cycled once per loop; defaults to all 'full'
}

const R = null;

// Note name -> frequency, computed on demand instead of precomputing an
// 84-entry table at load time.
const SEMI: Record<string, number> = {
  C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11,
};
const NOTE_RE = /^([A-G]#?)(\d)$/;
const freq = (note: string): number => {
  const m = NOTE_RE.exec(note)!;
  const midi = (+m[2] + 1) * 12 + SEMI[m[1]];
  return 440 * 2 ** ((midi - 69) / 12);
};

const tracks: Record<TrackName, Track> = {

  // 1) Overworld
  overworld: {
    step: 0.2,
    melodyType: 'triangle',
    melodyVariants: [
      [
        'E4', R, 'G4', 'A4', 'G4', R, 'E4', 'D4',
        'E4', R, 'G4', 'A4', 'C5', R, 'A4', 'G4',
        'C5', R, 'B4', 'A4', 'G4', R, 'E4', 'D4',
        'E4', 'D4', 'C4', R, 'D4', 'E4', 'D4', R,
      ],
    ],
    bassType: 'triangle',
    bassVariants: [
      [
        'C3', R, 'C3', R, 'G2', R, 'G2', R,
        'A2', R, 'A2', R, 'G2', R, 'G2', R,
        'C3', R, 'C3', R, 'G2', R, 'G2', R,
        'F2', R, 'F2', R, 'G2', R, 'G2', R,
      ],
      [
        'C3', R, 'D3', R, 'E3', R, 'G2', R,
        'A2', R, 'B2', R, 'C3', R, 'D3', R,
        'C3', R, 'B2', R, 'A2', R, 'G2', R,
        'F2', R, 'E2', R, 'D2', R, 'G2', R,
      ],
    ],
    kick:  [0, 8, 16, 24],
    snare: [4, 12, 20, 28],
    hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    swing: 0.12,
    fillEvery: 4,
    arrangement: ['full', 'full', 'noBass', 'full', 'drumsOnly', 'full', 'noDrums', 'full'],
  },

  // 2) Platforming
  platforming: {
    step: 0.14,
    melodyType: 'square',
    melodyVariants: [
      [
        'C4', 'E4', 'G4', 'E4', 'C5', 'G4', 'E4', 'G4',
        'A4', 'C5', 'E5', 'C5', 'A4', 'G4', 'E4', 'G4',
        'F4', 'A4', 'C5', 'A4', 'F5', 'C5', 'A4', 'C5',
        'D4', 'F4', 'A4', 'C5', 'G4', 'E4', 'D4', 'C4',
      ],
      [
        'A4', 'C5', 'E5', 'C5', 'A4', 'E4', 'A4', 'C5',
        'B4', 'D5', 'F5', 'D5', 'B4', 'A4', 'F4', 'A4',
        'G4', 'B4', 'D5', 'B4', 'G4', 'E4', 'G4', 'B4',
        'E4', 'A4', 'C5', 'E5', 'D5', 'B4', 'A4', 'E4',
      ],
    ],
    bassType: 'sawtooth',
    bassVariants: [
      [
        'C3', 'C3', 'G2', 'C3', 'C3', 'C3', 'G2', 'C3',
        'F2', 'F2', 'C3', 'F2', 'F2', 'F2', 'C3', 'F2',
        'G2', 'G2', 'D3', 'G2', 'G2', 'G2', 'D3', 'G2',
        'C3', 'C3', 'G2', 'C3', 'G2', 'G2', 'C3', 'C3',
      ],
      [
        'A2', 'A2', 'E2', 'A2', 'A2', 'A2', 'E2', 'A2',
        'F2', 'F2', 'C3', 'F2', 'F2', 'F2', 'C3', 'F2',
        'G2', 'G2', 'D3', 'G2', 'G2', 'G2', 'D3', 'G2',
        'E2', 'E2', 'A2', 'E2', 'A2', 'A2', 'E2', 'E2',
      ],
    ],
    kick:  [0, 4, 8, 12, 16, 20, 24, 28],
    snare: [4, 12, 20, 28],
    hihat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    swing: 0.08,
    fillEvery: 4,
    arrangement: ['full', 'full', 'drumsOnly', 'full', 'full', 'noDrums', 'full', 'noBass'],
  },

  // 3) Cavern
  cavern: {
    step: 0.22,
    melodyType: 'sawtooth',
    melodyVariants: [
      [
        'A3', R, R, 'C4', R, R, 'G3', R,
        'A3', R, R, 'E4', R, R, 'C4', R,
        'F3', R, R, 'A3', R, R, 'G3', R,
        'E3', R, 'G3', R, 'F3', R, 'E3', R,
      ],
      [
        'C4', R, R, R, 'A3', R, R, R,
        'G3', R, R, R, 'E3', R, R, R,
        'D3', R, R, R, 'F3', R, R, R,
        'E3', R, R, 'D3', R, R, 'C3', R,
      ],
    ],
    bassType: 'sine',
    bassVariants: [
      [
        'A2', R, R, R, 'A2', R, R, R,
        'F2', R, R, R, 'F2', R, R, R,
        'G2', R, R, R, 'G2', R, R, R,
        'E2', R, R, R, 'E2', R, R, R,
      ],
      [
        'A2', R, R, R, 'G2', R, R, R,
        'F2', R, R, R, 'E2', R, R, R,
        'D2', R, R, R, 'F2', R, R, R,
        'E2', R, R, R, 'C2', R, R, R,
      ],
    ],
    kick:  [0, 8, 16, 24],
    snare: [8, 24],
    hihat: [0, 4, 8, 12, 16, 20, 24, 28],
    detune: -8,
    fillEvery: 4,
    arrangement: ['full', 'noDrums', 'full', 'noBass', 'drumsOnly', 'full', 'noDrums', 'full'],
  },
};

class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private currentLoopId = 0;
  private currentTrack: TrackName | null = null;
  private volume = 0.28; // target volume, used as the fade-in destination

  private init(): void {
    if (this.ctx) return;
    const Ctx = typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext);
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;
    this.master.connect(this.ctx.destination);
  }

  // Smoothly ramps the master gain to `target` over `duration` seconds.
  private fadeTo(target: number, duration: number): void {
    if (!this.master || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + duration);
  }

  // ── shared envelope/noise helpers ──────────────────────────
  // attack -> sustain -> release (used by tonal notes/drones)
  private sustainEnv(g: GainNode, t0: number, dur: number, vol: number, attack: number, release: number): void {
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.setValueAtTime(vol, Math.max(t0 + attack, t0 + dur - release));
    g.gain.linearRampToValueAtTime(0, t0 + dur);
  }

  // immediate hit -> exponential decay (used by percussion)
  private expEnv(g: GainNode, t0: number, vol: number, decay: number): void {
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + decay);
  }

  // short linear attack -> exponential decay (used by the bell partials)
  private ad(g: GainNode, t0: number, vol: number, attack: number, decay: number): void {
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + attack + decay);
  }

  // white-noise burst; `taper` bakes a linear fade into the buffer itself
  private noiseBuf(dur: number, taper = false): AudioBufferSourceNode {
    const ctx = this.ctx!;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (taper ? 1 - i / n : 1);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }
  // ────────────────────────────────────────────────────────────

  private playNote(freqHz: number, t0: number, dur: number, type: OscType, vol: number, detune = 0): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freqHz; o.detune.value = detune;
    const g = ctx.createGain();
    this.sustainEnv(g, t0, dur, vol, 0.008, Math.min(0.15, dur * 0.5));
    o.connect(g); g.connect(this.master!);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  private playKick(t0: number, vol = 0.9): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t0);
    o.frequency.exponentialRampToValueAtTime(40, t0 + 0.1);
    const g = ctx.createGain();
    this.expEnv(g, t0, vol, 0.22);
    o.connect(g); g.connect(this.master!);
    o.start(t0); o.stop(t0 + 0.25);
  }

  private playSnare(t0: number, vol = 0.6): void {
    const ctx = this.ctx!;
    const noise = this.noiseBuf(0.15, true);
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass'; nf.frequency.value = 1000;
    const ng = ctx.createGain();
    this.expEnv(ng, t0, vol, 0.13);
    noise.connect(nf); nf.connect(ng); ng.connect(this.master!);
    noise.start(t0);

    const tone = ctx.createOscillator();
    tone.type = 'triangle'; tone.frequency.value = 180;
    const tg = ctx.createGain();
    this.expEnv(tg, t0, vol * 0.5, 0.08);
    tone.connect(tg); tg.connect(this.master!);
    tone.start(t0); tone.stop(t0 + 0.1);
  }

  private playHihat(t0: number, vol = 0.25): void {
    const ctx = this.ctx!;
    const noise = this.noiseBuf(0.05);
    const f = ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 7000;
    const g = ctx.createGain();
    this.expEnv(g, t0, vol, 0.04);
    noise.connect(f); f.connect(g); g.connect(this.master!);
    noise.start(t0);
  }

  // Dark tolling bell for the death sting: sine partials at inharmonic
  // ratios (not clean integer multiples) so it reads as metal, not a pure
  // tone. Higher partials decay faster, giving the "shimmer then hollow
  // out" character of a real bell.
  private playBell(freqHz: number, t0: number, dur: number, vol = 0.5): void {
    const ctx = this.ctx!;
    const partials: [number, number][] = [[1, 1], [2.01, 0.55], [2.74, 0.32], [3.98, 0.18], [5.43, 0.1]];
    partials.forEach(([ratio, g0], i) => {
      const decay = Math.max(0.3, dur * (1 - i * 0.15));
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = freqHz * ratio;
      const g = ctx.createGain();
      this.ad(g, t0, vol * g0, 0.02, decay);
      o.connect(g); g.connect(this.master!);
      o.start(t0); o.stop(t0 + decay + 0.1);
    });
  }

  // Low dissonant drone: two detuned sawtooths through a lowpass filter.
  // Stack two a minor 2nd apart for that uneasy Souls-death-screen quality.
  private playDrone(freqHz: number, t0: number, dur: number, vol = 0.3): void {
    const ctx = this.ctx!;
    [-4, 4].forEach((detune) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = freqHz; o.detune.value = detune;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 400;
      const g = ctx.createGain();
      this.sustainEnv(g, t0, dur, vol, 0.6, dur * 0.4);
      o.connect(f); f.connect(g); g.connect(this.master!);
      o.start(t0); o.stop(t0 + dur + 0.1);
    });
  }

  private scheduleLoop(name: TrackName): void {
    const ctx = this.ctx!;
    const t = tracks[name];
    const loopId = ++this.currentLoopId;
    const stepsPerLoop = t.melodyVariants[0].length;
    const fillEvery = t.fillEvery ?? 4;
    const arrangement: LayerMode[] = t.arrangement ?? ['full'];

    let stepIndex = 0;
    let loopCount = 0;
    let nextTime = ctx.currentTime + 0.05;

    const scheduleAhead = (): void => {
      if (loopId !== this.currentLoopId) return;
      while (nextTime < ctx.currentTime + 0.5) {
        const i = stepIndex % stepsPerLoop;
        if (i === 0 && stepIndex !== 0) loopCount++;

        const variant = loopCount % t.melodyVariants.length;
        const melody = t.melodyVariants[variant];
        const bass = t.bassVariants[variant];
        const mode = arrangement[loopCount % arrangement.length];

        const isFillZone = (loopCount + 1) % fillEvery === 0 && i >= stepsPerLoop - 4 && mode !== 'noDrums';
        const swingOffset = t.swing && i % 2 === 1 ? t.step * t.swing : 0;
        const hitTime = nextTime + swingOffset;

        const melodyAllowed = mode !== 'drumsOnly';
        const bassAllowed = melodyAllowed && mode !== 'noBass';
        const drumsAllowed = mode !== 'noDrums';

        const tryNote = (allowed: boolean, arr: (string | null)[], type: OscType, durMult: number, vol: number): void => {
          const note = allowed && arr[i];
          if (note) this.playNote(freq(note), hitTime, t.step * durMult, type, vol, t.detune ?? 0);
        };
        tryNote(melodyAllowed, melody, t.melodyType, 0.85, 0.3);
        tryNote(bassAllowed, bass, t.bassType, 1.4, 0.35);

        if (drumsAllowed) {
          if (isFillZone) {
            this.playSnare(hitTime, 0.5);
            if (i % 2 === 0) this.playKick(hitTime, 0.6);
          } else {
            if (t.kick.includes(i)) this.playKick(hitTime);
            if (t.snare.includes(i)) this.playSnare(hitTime);
            if (t.hihat.includes(i)) this.playHihat(hitTime);
            else if (Math.random() < 0.08) this.playHihat(hitTime, 0.08);
          }
        }

        nextTime += t.step;
        stepIndex++;
      }
      setTimeout(scheduleAhead, 100);
    };
    scheduleAhead();
  }

  play(name: TrackName): void {
    this.init();
    if (!this.ctx || !tracks[name] || this.currentTrack === name) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const fadeDur = 0.3;
    const start = (): void => {
      this.currentTrack = name;
      this.scheduleLoop(name);
      this.fadeTo(this.volume, fadeDur);
    };

    if (this.currentTrack !== null || this.currentLoopId > 0) {
      // Fade the old track out first, then swap and fade the new one in.
      this.fadeTo(0, fadeDur);
      setTimeout(() => { this.stop(); start(); }, fadeDur * 1000);
    } else {
      this.master!.gain.value = 0;
      start();
    }
  }

  // Dark Souls / Elden Ring style "YOU DIED" sting: a low dissonant drone
  // (root + minor 2nd, for dread) under a metallic tolling bell, with a
  // fainter second toll near the end for closure. All synthesized, no
  // samples. Fades out whatever's currently playing, plays the sting
  // (~3.5s, fits inside a ~4s death screen), then goes silent — call
  // Music.play(...) again for the next level/retry.
  playDeathJingle(): void {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const startJingle = (): void => {
      this.currentTrack = null;
      this.fadeTo(this.volume, 0);
      const ctx = this.ctx!;
      const t0 = ctx.currentTime + 0.05;

      this.playDrone(freq('A1'), t0, 3.3, 0.28);
      this.playDrone(freq('A#1'), t0, 3.3, 0.14);
      this.playBell(freq('A2'), t0 + 0.1, 2.6, 1.5);
      this.playBell(freq('E2'), t0 + 1.0, 1.5, 1.28);
    };

    if (this.currentTrack !== null || this.currentLoopId > 0) {
      this.stop();
    }
    this.master!.gain.value = 0;
    startJingle();
  }

  stop(): void {
    this.currentLoopId++;
    this.currentTrack = null;
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }
}

const Music = new MusicEngine();

// ── Usage ────────────────────────────────────────────────────
// Music.play('overworld');       // call on user's first input/click (autoplay policy)
// Music.play('platforming');     // crossfades automatically from whatever's playing
// Music.play('cavern');
// Music.playDeathJingle();       // ~3.5s dark bell + drone sting for the death screen
// Music.stop();
// Music.setVolume(0.2);

export default Music;
export type { TrackName };