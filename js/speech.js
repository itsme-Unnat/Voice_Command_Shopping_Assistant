/**
 * Voice Command Shopping Assistant - Speech Engine
 * Manages:
 * 1. Web Speech Recognition (Microphone, continuous listening, interim stream, multi-language)
 * 2. Speech Synthesis (Natural TTS audio feedback with customizable voice/rate)
 * 3. Live Canvas Audio Waveform Visualizer (Web Audio API spectrum analyzer)
 * 4. Fallback Simulated Speech & Virtual Voice Input
 */

class SpeechEngine {
  constructor({ onResult, onInterim, onStateChange, onError } = {}) {
    this.onResult = onResult || (() => {});
    this.onInterim = onInterim || (() => {});
    this.onStateChange = onStateChange || (() => {});
    this.onError = onError || (() => {});

    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
    this.currentLanguage = "en-US";
    this.continuous = true;

    // Web Audio visualizer properties
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.visualizerCanvas = null;
    this.canvasCtx = null;
    this.animationFrameId = null;
    this.isVisualizerActive = false;

    this.initRecognition();
  }

  // Initialize SpeechRecognition
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange({ status: "listening", isListening: true });
        this.startVisualizer();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          this.onInterim(interimTranscript);
        }

        if (finalTranscript) {
          this.onResult(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.onError(event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.stop();
        }
      };

      this.recognition.onend = () => {
        // Auto-restart if continuous listening is enabled and still set to listening
        if (this.isListening && this.continuous) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            this.stopVisualizer();
            this.onStateChange({ status: "idle", isListening: false });
          }
        } else {
          this.isListening = false;
          this.stopVisualizer();
          this.onStateChange({ status: "idle", isListening: false });
        }
      };
    } else {
      console.warn("Web Speech API not supported in this browser. Simulation mode available.");
    }
  }

  // Set Language for recognition and speech
  setLanguage(langCode) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      const wasListening = this.isListening;
      if (wasListening) this.recognition.stop();
      this.recognition.lang = langCode;
      if (wasListening) {
        setTimeout(() => this.recognition.start(), 200);
      }
    }
  }

  // Start listening
  start() {
    if (this.isListening) return;

    if (this.recognition) {
      try {
        this.isListening = true;
        this.recognition.lang = this.currentLanguage;
        this.recognition.start();
      } catch (err) {
        console.warn("Could not start recognition:", err);
        this.isListening = false;
      }
    } else {
      this.onStateChange({ status: "simulated-listening", isListening: true });
      this.startVisualizer();
    }
  }

  // Stop listening
  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.stopVisualizer();
    this.onStateChange({ status: "idle", isListening: false });
  }

  // Toggle listening
  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  // Text-To-Speech Output
  speak(text, { onEnd, rate = 1.0, pitch = 1.0 } = {}) {
    if (!this.synthesis || !text) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing utterance
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick best available voice for language
    const voices = this.synthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(this.currentLanguage.split("-")[0])) || voices[0];
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      this.onStateChange({ status: "speaking", isSpeaking: true });
      this.startSimulatedPulse();
    };

    utterance.onend = () => {
      this.onStateChange({ status: this.isListening ? "listening" : "idle", isSpeaking: false });
      if (!this.isListening) this.stopVisualizer();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.onStateChange({ status: this.isListening ? "listening" : "idle", isSpeaking: false });
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  // Attach Canvas for Waveform Animation
  bindVisualizer(canvasElement) {
    this.visualizerCanvas = canvasElement;
    if (this.visualizerCanvas) {
      this.canvasCtx = this.visualizerCanvas.getContext("2d");
      this.drawIdleWaveform();
    }
  }

  // Start Audio Spectrum Visualizer
  async startVisualizer() {
    this.isVisualizerActive = true;

    if (!this.audioContext) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          this.audioContext = new AudioContext();
          this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);
        }
      } catch (err) {
        // Fallback to dynamic synthetic visualizer
        this.analyser = null;
      }
    }

    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.animateVisualizer();
  }

  stopVisualizer() {
    this.isVisualizerActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.drawIdleWaveform();
  }

  startSimulatedPulse() {
    this.isVisualizerActive = true;
    this.animateVisualizer();
  }

  animateVisualizer() {
    if (!this.visualizerCanvas || !this.canvasCtx) return;

    const canvas = this.visualizerCanvas;
    const ctx = this.canvasCtx;
    const width = canvas.width;
    const height = canvas.height;

    let dataArray;
    if (this.analyser) {
      const bufferLength = this.analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
    }

    const draw = () => {
      if (!this.isVisualizerActive) {
        this.drawIdleWaveform();
        return;
      }

      this.animationFrameId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width, height);

      const bars = 24;
      const barWidth = (width / bars) - 3;
      const time = Date.now() / 150;

      for (let i = 0; i < bars; i++) {
        let barHeight;
        if (dataArray && dataArray[i]) {
          barHeight = (dataArray[i] / 255) * height * 0.9;
        } else {
          // Dynamic harmonic synthetic waves
          const wave1 = Math.sin(time + i * 0.4);
          const wave2 = Math.cos(time * 0.7 + i * 0.3);
          const norm = (wave1 + wave2 + 2) / 4;
          barHeight = Math.max(6, norm * (height * 0.8));
        }

        const x = i * (barWidth + 3);
        const y = (height - barHeight) / 2;

        // Radiant emerald to cyan gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#10b981");
        gradient.addColorStop(0.5, "#06b6d4");
        gradient.addColorStop(1, "#6366f1");

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(16, 185, 129, 0.5)";

        // Rounded pill bars
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 4);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }
    };

    draw();
  }

  drawIdleWaveform() {
    if (!this.visualizerCanvas || !this.canvasCtx) return;
    const canvas = this.visualizerCanvas;
    const ctx = this.canvasCtx;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
    ctx.shadowBlur = 0;

    const bars = 24;
    const barWidth = (width / bars) - 3;
    const barHeight = 4;

    for (let i = 0; i < bars; i++) {
      const x = i * (barWidth + 3);
      const y = (height - barHeight) / 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, 2);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    }
  }

  // Simulate user speech command (useful for testing and virtual input)
  simulateVoiceCommand(commandText) {
    this.onInterim(commandText);
    this.startSimulatedPulse();

    setTimeout(() => {
      this.onResult(commandText);
      setTimeout(() => {
        if (!this.isListening) this.stopVisualizer();
      }, 800);
    }, 400);
  }
}

// Export for Node/CommonJS if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SpeechEngine };
}
