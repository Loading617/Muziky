<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
  
    let audioElement: HTMLAudioElement;
    let canvasElement: HTMLCanvasElement;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let energyHistory: number[] = [];
    let beatDetected = false;
    let animationFrameId: number;
  
    const presets = ['Bars', 'Waveform', 'Beat-Pulse'];
    const currentPreset = writable('Bars');
    let selectedPreset = 'Bars';
  
    const BEAT_THRESHOLD = 0.5;
    const HISTORY_SIZE = 50;
  
    function setupAudioContext() {
      audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioElement);
      analyser = audioContext.createAnalyser();
  
      source.connect(analyser);
      analyser.connect(audioContext.destination);
  
      analyser.fftSize = 128;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
  
      renderVisualizer();
    }
  
    function detectBeat(energy: number): boolean {
      energyHistory.push(energy);
  
      if (energyHistory.length > HISTORY_SIZE) {
        energyHistory.shift();
      }
  
      if (energyHistory.length < HISTORY_SIZE) {
        return false;
      }
  
      const avgEnergy =
        energyHistory.reduce((sum, val) => sum + val, 0) / energyHistory.length;
  
      return energy > avgEnergy * (1 + BEAT_THRESHOLD);
    }
  
    function renderVisualizer() {
      const canvas = canvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const draw = () => {
        animationFrameId = requestAnimationFrame(draw);
  
        analyser.getByteFrequencyData(dataArray);
  
        const energy =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        beatDetected = detectBeat(energy);
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        if (selectedPreset === 'Bars') {
          drawBars(ctx, dataArray, canvas);
        } else if (selectedPreset === 'Waveform') {
          drawWaveform(ctx, dataArray, canvas);
        } else if (selectedPreset === 'Beat-Pulse') {
          drawBeatPulse(ctx, canvas, beatDetected);
        }
      };
  
      draw();
    }
  
    function drawBars(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
      const barWidth = canvas.width / data.length;
      let x = 0;
  
      data.forEach((value) => {
        const barHeight = (value / 255) * canvas.height;
        ctx.fillStyle = 'rgb(50, 150, 255)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });
    }
  
    function drawWaveform(ctx: CanvasRenderingContext2D, data: Uint8Array, canvas: HTMLCanvasElement) {
      analyser.getByteTimeDomainData(data);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(50, 150, 255)';
      ctx.beginPath();
  
      const sliceWidth = canvas.width / data.length;
      let x = 0;
  
      data.forEach((value, i) => {
        const v = value / 128.0;
        const y = (v * canvas.height) / 2;
  
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
  
        x += sliceWidth;
      });
  
      ctx.stroke();
    }
  
    function drawBeatPulse(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, beat: boolean) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = beat ? Math.min(canvas.width, canvas.height) / 4 : Math.min(canvas.width, canvas.height) / 6;
  
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
      ctx.fillStyle = beat ? 'rgb(255, 50, 50)' : 'rgb(50, 150, 255)';
      ctx.fill();
    }
  
    onMount(() => {
      audioElement.addEventListener('play', setupAudioContext);
    });
  
    onDestroy(() => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) audioContext.close();
    });
  </script>
  
  <style>
    .visualizer {
      width: 100%;
      height: 300px;
      background: #000;
      border-radius: 10px;
    }
  
    .controls {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
  
  <div>
    <h2>Muziky</h2>
  
    <!-- Audio Element -->
    <audio bind:this={audioElement} controls>
      <source src="your-audio-file.mp3" type="audio/mp3" />
    </audio>
  
    <!-- Canvas for Visualizer -->
    <canvas class="visualizer" bind:this={canvasElement}></canvas>
  
    <!-- Controls -->
    <div class="controls">
      <label for="preset">Visualization Preset:</label>
      <select id="preset" bind:value={selectedPreset}>
        {#each presets as preset}
          <option value={preset}>{preset}</option>
        {/each}
      </select>
    </div>
  </div>
  