<script lang="ts">
    import { onMount } from 'svelte';
  
    export let audio: HTMLAudioElement | null = null;
  
    let filters: BiquadFilterNode[] = [];
  
    onMount(() => {
      if (!audio) return;
  
      const context = new AudioContext();
      const source = context.createMediaElementSource(audio);
  
      const frequencies = [60, 170, 350, 1000, 3500, 10000];
      filters = frequencies.map(freq => {
        const filter = context.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0; // Initial gain
        return filter;
      });
  
      // Chain filters
      filters.reduce((prev, curr) => {
        prev.connect(curr);
        return curr;
      }).connect(context.destination);
  
      source.connect(filters[0]);
    });
  
    function updateGain(index: number, value: number) {
      filters[index].gain.value = value;
    }
  </script>
  
  <div>
    <h3>Equalizer</h3>
    {#each filters as _, index}
      <div>
        <label>Band {index + 1}</label>
        <input type="range" min="-10" max="10" step="1" on:input={(e) => updateGain(index, +e.target.value)} />
      </div>
    {/each}
  </div>
  