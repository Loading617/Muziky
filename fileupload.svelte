<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  
    function handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        dispatch('fileSelected', { file: files[0] });
      }
    }
  </script>
  
  <input type="file" accept="audio/*" on:change={handleFileChange} />
