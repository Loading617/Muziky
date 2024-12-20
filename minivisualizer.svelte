<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
  
    let audioElement: HTMLAudioElement;
    let canvasElement: HTMLCanvasElement;
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let animationFrameId: number;
  
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
  
      // Connect audio element to analyser and destination
      source.connect(analyser);
      analyser.connect(audioContext.destination);
  
      analyser.fftSize = 64; // Number of frequency bins
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
  
      // Start visualizer rendering
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
  
        const barWidth = canvas.width / dataArray.length;
        let x = 0;
  
        dataArray.forEach((value) => {
          const barHeight = (value / 255) * canvas.height;
  
          ctx.fillStyle = 'rgb(50, 150, 255)';
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
  
          x += barWidth + 1;
        });
      };
  
      draw();
    }
  
    onDestroy(() => {
      cancelAnimationFrame(animationFrameId);
      if (audioContext) audioContext.close();
    });
  </script>

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
  