<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let audio: HTMLAudioElement | null = null;

  let canvas: HTMLCanvasElement;
  let animationId: number;
  let context: AudioContext | null = null;

  let beatDetected = false;

  onMount(() => {
    if (!audio) return;

    context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(context.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const canvasContext = canvas.getContext('2d');

    // Variables for beat detection
    let lastPeak = 0;
    const sensitivity = 1.2;

    function detectBeat(energy: number) {
      const now = performance.now();
      if (energy > sensitivity && now - lastPeak > 300) {
        lastPeak = now;
        beatDetected = true;

        setTimeout(() => (beatDetected = false), 150);
      }
    }

    function drawVisualizer() {
      analyser.getByteFrequencyData(dataArray);

      const averageEnergy = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      detectBeat(averageEnergy);

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / dataArray.length;

      dataArray.forEach((value, index) => {
        const barHeight = (value / 255) * canvas.height;
        canvasContext.fillStyle = beatDetected
          ? 'rgb(255, 0, 0)' // Highlight when a beat is detected
          : `hsl(${(index / dataArray.length) * 360}, 100%, 50%)`;
        canvasContext.fillRect(index * barWidth, canvas.height - barHeight, barWidth, barHeight);
      });

      animationId = requestAnimationFrame(drawVisualizer);
    }

    drawVisualizer();

    return () => cancelAnimationFrame(animationId);
  });

  onDestroy(() => context?.close());
</script>

<canvas bind:this={canvas} width="600" height="300" style="border: 1px solid #ccc;"></canvas>

<div class="beat-indicator" style="background-color: {beatDetected ? 'red' : 'transparent'}"></div>
