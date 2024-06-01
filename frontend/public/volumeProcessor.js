// public/volume-processor.js

class VolumeProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._volume = 0;
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input.length > 0) {
        const samples = input[0];
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          sum += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sum / samples.length);
        let volume = 20 * Math.log10(rms);
  
        if (isNaN(volume) || volume === -Infinity) {
          volume = -100;
        }
  
        this.port.postMessage({ volume });
      }
      return true;
    }
  }
  
  registerProcessor('volume-processor', VolumeProcessor);
  