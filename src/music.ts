// ─────────────────────────────────────────────────────────────
// Procedural background music for js13k (no audio assets used)
// Pure Web Audio API oscillator synth + step sequencer.
// Drop in, call Music.play('overworld') etc.
// ─────────────────────────────────────────────────────────────

type OscType = OscillatorType; // 'sine' | 'square' | 'sawtooth' | 'triangle'
type TrackName = 'overworld' | 'platforming' | 'cavern';

interface Track {
  step: number; // seconds per step
  melodyType: OscType;
  melody: (string | null)[]; // note name or null (rest), one per step
  bassEvery: number; // bass note plays every N steps
  bass: string[]; // cycled bass notes
  ticks: number[]; // step indices where a percussion tick fires
  detune?: number; // cents, optional mood wobble
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

const tracks: Record<TrackName, Track> = {
  // 1) Overworld / Sage intro — gentle, naive, major key, waltz-ish
  overworld: {
    step: 0.28,
    melodyType: 'triangle',
    melody: [
      'E4',
      null,
      'G4',
      null,
      'A4',
      null,
      'G4',
      null,
      'E4',
      null,
      'D4',
      null,
      'C4',
      null,
      null,
      null,
      'C4',
      null,
      'E4',
      null,
      'G4',
      null,
      'E4',
      null,
      'D4',
      null,
      'C4',
      null,
      null,
      null,
      null,
      null,
    ],
    bassEvery: 4,
    bass: ['C3', 'C3', 'G2', 'G2', 'A2', 'A2', 'G2', 'G2'],
    ticks: [0, 8, 16, 24],
  },

  // 2) Pre-trap platforming — bouncier, playful, forward motion
  platforming: {
    step: 0.18,
    melodyType: 'square',
    melody: [
      'C4',
      'E4',
      'G4',
      'E4',
      'C4',
      'E4',
      'G4',
      'B4',
      'C5',
      'B4',
      'G4',
      'E4',
      'D4',
      'F4',
      'A4',
      'F4',
      'D4',
      'F4',
      'A4',
      'C5',
      'D4',
      'F4',
      'A4',
      'G4',
      'C4',
      'E4',
      'G4',
      'E4',
      'C4',
      null,
      null,
      null,
    ],
    bassEvery: 4,
    bass: ['C3', 'C3', 'F2', 'F2', 'G2', 'G2', 'C3', 'C3'],
    ticks: [0, 4, 8, 12, 16, 20, 24, 28],
  },

  // 3) Cavern — sparse, moody, minor, roomy
  cavern: {
    step: 0.4,
    melodyType: 'sine',
    melody: [
      'A3',
      null,
      null,
      null,
      'C4',
      null,
      null,
      null,
      'G3',
      null,
      null,
      null,
      'E3',
      null,
      null,
      null,
      'F3',
      null,
      null,
      null,
      'A3',
      null,
      null,
      null,
      'E3',
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    bassEvery: 8,
    bass: ['A2', 'F2'],
    ticks: [0, 16],
    detune: -6,
  },
};

class MusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private currentLoopId = 0;

  private init(): void {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.25;
    this.master.connect(this.ctx.destination);
  }

  private playNote(
    freq: number,
    startTime: number,
    dur: number,
    type: OscType = 'triangle',
    vol = 1,
    detune = 0
  ): void {
    const ctx = this.ctx!;
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
    gain.connect(this.master!);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  private playPad(freq: number, startTime: number, dur: number, vol = 0.5): void {
    this.playNote(freq, startTime, dur, 'sine', vol);
  }

  private playTick(startTime: number, vol = 0.15): void {
    const ctx = this.ctx!;
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
    gain.connect(this.master!);
    src.start(startTime);
  }

  private scheduleLoop(name: TrackName): void {
    const ctx = this.ctx!;
    const t = tracks[name];
    const loopId = ++this.currentLoopId;
    const stepsPerLoop = t.melody.length;
    let stepIndex = 0;
    let nextTime = ctx.currentTime + 0.05;

    const scheduleAhead = (): void => {
      if (loopId !== this.currentLoopId) return; // stopped/switched
      while (nextTime < ctx.currentTime + 0.5) {
        const i = stepIndex % stepsPerLoop;
        const note = t.melody[i];
        if (note) {
          this.playNote(
            NOTE_FREQS[note],
            nextTime,
            t.step * 0.9,
            t.melodyType,
            0.35,
            t.detune ?? 0
          );
        }
        if (i % t.bassEvery === 0) {
          const bassNote = t.bass[(i / t.bassEvery) % t.bass.length];
          if (bassNote)
            this.playPad(NOTE_FREQS[bassNote], nextTime, t.step * t.bassEvery * 0.95, 0.3);
        }
        if (t.ticks.includes(i)) {
          this.playTick(nextTime);
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
    if (this.ctx!.state === 'suspended') this.ctx!.resume();
    if (!tracks[name]) {
      console.warn('Unknown track:', name);
      return;
    }
    this.scheduleLoop(name);
  }

  stop(): void {
    this.currentLoopId++; // invalidates any pending scheduleAhead loop
  }

  setVolume(v: number): void {
    if (this.master) this.master.gain.value = v;
  }
}

const Music = new MusicEngine();

// ── Usage ────────────────────────────────────────────────────
// Music.play('overworld');     // call on user's first input/click (autoplay policy)
// Music.play('platforming');   // switch when entering the platforming level
// Music.play('cavern');        // switch when Mike lands in the cavern
// Music.stop();                // silence
// Music.setVolume(0.15);       // 0..1

export default Music;
export type { TrackName };
