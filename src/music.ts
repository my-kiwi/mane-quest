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

const NOTE_FREQS: Record<string, number> = {};
(() => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let oct = 1; oct <= 7; oct++) {
    names.forEach((n, i) => {
      const midi = (oct + 1) * 12 + i;
      NOTE_FREQS[n + oct] = 440 * Math.pow(2, (midi - 69) / 12);
    });
  }
})();

const R = null;

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
      // [
      //   'G4', 'A4', 'C5', R, 'B4', 'A4', 'G4', R,
      //   'G4', 'A4', 'C5', 'D5', 'C5', R, 'A4', 'G4',
      //   'E5', R, 'D5', 'C5', 'B4', 'A4', 'G4', R,
      //   'A4', 'G4', 'E4', R, 'C4', 'D4', 'E4', R,
      // ],
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
    // 8-loop cycle: mostly full, one drum-only break, one no-bass breather, one no-drums melodic moment
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
    // busier arrangement to match higher energy: quick drum breakdown, a no-drums melodic breather, then back
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
    // sparser overall, so lean into eerie no-drums stretches and one drums-only "heartbeat" moment
    arrangement: ['full', 'noDrums', 'full', 'noBass', 'drumsOnly', 'full', 'noDrums', 'full'],
  },
};

class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private currentLoopId = 0;
  private currentTrack: TrackName | null = null;

  private init(): void {
    if (this.ctx) return;

    const hasWindowAudio = typeof window !== 'undefined';
    const Ctx = hasWindowAudio ? window.AudioContext || (window as any).webkitAudioContext : undefined;

    if (!Ctx) {
      return;
    }

    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.28;
    this.master.connect(this.ctx.destination);
  }

  private playNote(
    freq: number,
    startTime: number,
    dur: number,
    type: OscType,
    vol: number,
    detune = 0
  ): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;

    const attack = 0.008;
    const release = Math.min(0.15, dur * 0.5);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + attack);
    gain.gain.setValueAtTime(vol, Math.max(startTime + attack, startTime + dur - release));
    gain.gain.linearRampToValueAtTime(0, startTime + dur);

    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  private playKick(startTime: number, vol = 0.9): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
    osc.connect(gain);
    gain.connect(this.master!);
    osc.start(startTime);
    osc.stop(startTime + 0.25);
  }

  private playSnare(startTime: number, vol = 0.6): void {
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.master!);
    noise.start(startTime);

    const tone = ctx.createOscillator();
    tone.type = 'triangle';
    tone.frequency.value = 180;
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(vol * 0.5, startTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
    tone.connect(toneGain);
    toneGain.connect(this.master!);
    tone.start(startTime);
    tone.stop(startTime + 0.1);
  }

  private playHihat(startTime: number, vol = 0.25): void {
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    noise.start(startTime);
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

        const isFillLoop = (loopCount + 1) % fillEvery === 0;
        const isFillZone = isFillLoop && i >= stepsPerLoop - 4 && mode !== 'noDrums';

        const swingOffset = t.swing && i % 2 === 1 ? t.step * t.swing : 0;
        const hitTime = nextTime + swingOffset;

        const melodyAllowed = mode !== 'drumsOnly';
        const bassAllowed = mode !== 'drumsOnly' && mode !== 'noBass';
        const drumsAllowed = mode !== 'noDrums';

        if (melodyAllowed) {
          const note = melody[i];
          if (note) {
            this.playNote(NOTE_FREQS[note], hitTime, t.step * 0.85, t.melodyType, 0.3, t.detune ?? 0);
          }
        }
        if (bassAllowed) {
          const bassNote = bass[i];
          if (bassNote) {
            this.playNote(NOTE_FREQS[bassNote], hitTime, t.step * 1.4, t.bassType, 0.35, t.detune ?? 0);
          }
        }

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
    if (!this.ctx) {
      return;
    }

    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (!tracks[name]) {
      console.warn('Unknown track:', name);
      return;
    }

    if(this.currentTrack === name) {
      console.log('already playing ', name);
      return;
    }

    if (this.currentLoopId > 0) {
      this.stop();
    }
    this.currentTrack = name;
    this.scheduleLoop(name);
  }

  stop(): void {
    this.currentLoopId++;
  }

  setVolume(v: number): void {
    if (this.master) this.master.gain.value = v;
  }
}

const Music = new MusicEngine();

// ── Usage ────────────────────────────────────────────────────
// Music.play('overworld');     // call on user's first input/click (autoplay policy)
// Music.play('platforming');
// Music.play('cavern');
// Music.stop();
// Music.setVolume(0.2);

export default Music;
export type { TrackName };