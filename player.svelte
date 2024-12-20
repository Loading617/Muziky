<script lang="ts">
    export let file: File | null = null;
    let audio: HTMLAudioElement;
  
    function play() {
      audio.play();
    }
    function pause() {
      audio.pause();
    }
  </script>
  
  {#if file}
    <div>
      <h3>Now Playing: {file.name}</h3>
      <audio bind:this={audio} src={URL.createObjectURL(file)}></audio>
      <button on:click={play}>Play</button>
      <button on:click={pause}>Pause</button>
    </div>
  {/if}
  