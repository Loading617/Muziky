<script lang="ts">
    import FileUpload from './FileUpload.svelte';
    import FolderUpload from './FolderUpload.svelte';
    import Player from './Player.svelte';
    import Mini Visualizer from './MiniVisualizer.svelte';
    import Beat Visualizer from './BeatVisualizer.svelte';
    import Equalizer from './Equalizer.svelte';
    import Music Library from './MusicLibrary.svelte';
    import Music Metadata from './MusicMetadata.svelte';

    let selectedFile: File | null = null;
    let audioElement: HTMLAudioElement | null = null;
  
    function handleFileSelected(event: CustomEvent) {
      selectedFile = event.detail.file;
    }
  </script>
  
  <main>
    <h1>Muziky</h1>
    <FolderUpload on:fileSelected={handleFileSelected} />
    <MusicLibrary />
    <MusicMetadata file={selectedFile} />
    <FileUpload on:fileSelected={handleFileSelected} />
    <Player bind:file={selectedFile} bind:audio={audioElement} />
    {#if audioElement}
      <BeatVisualizer {audioElement} />
      <MiniVisualizer {audioElement} />
      <Equalizer {audioElement} />
    {/if}
  </main>
  
