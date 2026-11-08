// NakshatraMM — Cosmic Ambient Sound Synthesizer via Web Audio API

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  public start() {
    if (this.isRunning) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Deep celestial drone chord: Root, Fifth, Octave, and subtle shimmering harmonic
      const frequencies = [108.0, 162.0, 216.0, 324.0, 432.0]; // 432Hz harmonic tuning

      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Gentle subtle frequency wobble (LFO)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        const baseGain = 0.04 / (idx + 1);
        oscGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();

        this.oscillators.push(osc);
      });

      this.isRunning = true;
    } catch (e) {
      console.warn('Web Audio Ambient error:', e);
    }
  }

  public stop() {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;

    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];
      if (this.ctx) {
        this.ctx.close();
        this.ctx = null;
      }
      this.isRunning = false;
    }, 1500);
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const cosmicAudio = new CosmicAudioEngine();
