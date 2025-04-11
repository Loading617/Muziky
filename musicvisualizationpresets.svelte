<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
  
    let audioElement: HTMLAudioElement;
    let canvasElement: HTMLCanvasElement;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let animationFrameId: number;
  
    const presets = ['Bars', 'Waveform', 'Circular'];
    const currentPreset = writable('Bars');
    let selectedPreset = 'Bars';
  
    let selectedTrack: { title: string; artist: string; url: string } | null = null;
  
    const playTrack = (track: { title: string; artist: string; url: string }) => {
      selectedTrack = track;
      audioElement.src = track.url;
      audioElement.play();
  
      if (!audioContext) setupAudioContext();
    };
  
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
  
    function renderVisualizer() {
      const canvas = canvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const draw = () => {
        animationFrameId = requestAnimationFrame(draw);
  
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        if (selectedPreset === 'Bars') {
          drawBars(ctx, dataArray, canvas);
        } else if (selectedPreset === 'Waveform') {
          drawWaveform(ctx, dataArray, canvas);
        } else if (selectedPreset === 'Circular') {
          drawCircular(ctx, dataArray, canvas);
        }
      };
  
      draw();
    }
  
    function drawBars(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) {
      const barWidth = canvas.width / dataArray.length;
      let x = 0;
  
      dataArray.forEach((value) => {
        const barHeight = (value / 255) * canvas.height;
  
        ctx.fillStyle = 'rgb(50, 150, 255)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  
        x += barWidth + 1;
      });
    }
  
    function drawWaveform(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) {
      analyser.getByteTimeDomainData(dataArray);
  
      ctx.strokeStyle = 'rgb(50, 150, 255)';
      ctx.lineWidth = 2;
      ctx.beginPath();
  
      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;
  
      dataArray.forEach((value, i) => {
        const v = value / 128.0;
        const y = (v * canvas.height) / 2;
  
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
  
        x += sliceWidth;
      });
  
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
  
    function drawCircular(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 4;
  
      dataArray.forEach((value, index) => {
        const angle = (index / dataArray.length) * Math.PI * 2;
        const barHeight = (value / 255) * radius;
  
        const xStart = centerX + Math.cos(angle) * radius;
        const yStart = centerY + Math.sin(angle) * radius;
        const xEnd = centerX + Math.cos(angle) * (radius + barHeight);
        const yEnd = centerY + Math.sin(angle) * (radius + barHeight);
  
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = `hsl(${(index / dataArray.length) * 360}, 100%, 50%)`;
        ctx.stroke();
      });
    }
  
    onDestroy(() => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) audioContext.close();
    });
  </script>
  
  <style>
    .now-playing {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }
  
    .visualizer {
      width: 300px;
      height: 150px;
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
  
    .preset-select {
      margin-top: 1rem;
    }
  
    audio {
      margin-top: 1rem;
      width: 100%;
    }
  </style>
  
  <div>
    <h2>Now Playing</h2>
  
    <!-- Now Playing Section -->
    {#if selectedTrack}
      <div class="now-playing">
        <div>
          <p><strong>{selectedTrack.title}</strong></p>
          <p>{selectedTrack.artist}</p>
        </div>
  
        <!-- Visualizer -->
        <canvas class="visualizer" bind:this={canvasElement}></canvas>
      </div>
  
      <!-- Preset Selector -->
      <div class="preset-select">
        <label for="preset">Visualization Preset:</label>
        <select id="preset" bind:value={selectedPreset}>
          {#each presets as preset}
            <option value={preset}>{preset}</option>
          {/each}
        </select>
      </div>
  
      <!-- Audio Player -->
      <audio bind:this={audioElement} controls></audio>
    {/if}
  
    <!-- Playlist -->
    <h3>Playlist</h3>
    <ul>
      <li on:click={() => playTrack({ title: 'Song 1', artist: 'Artist 1', url: 'song1.mp3' })}>
        Song 1 - Artist 1
      </li>
      <li on:click={() => playTrack({ title: 'Song 2', artist: 'Artist 2', url: 'song2.mp3' })}>
        Song 2 - Artist 2
      </li>
    </ul>
  </div>
  