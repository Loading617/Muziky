<script lang="ts">
    import FileUpload from './FileUpload.svelte';
    import Player from './Player.svelte';
    import Visualizer from './BeatVisualizer.svelte';
    import Equalizer from './Equalizer.svelte';
  
    let selectedFile: File | null = null;
    let audioElement: HTMLAudioElement | null = null;
  
    function handleFileSelected(event: CustomEvent) {
      selectedFile = event.detail.file;
    }
  </script>
  
  <main>
    <h1>Muziky</h1>
    <FileUpload on:fileSelected={handleFileSelected} />
    <Player bind:file={selectedFile} bind:audio={audioElement} />
    {#if audioElement}
      <Visualizer {audioElement} />
      <Equalizer {audioElement} />
    {/if}
  </main>
  