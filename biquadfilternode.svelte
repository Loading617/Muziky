<script lang="ts">
    import { writable } from 'svelte/store';
    import { onMount, onDestroy } from 'svelte';
  
    let audioElement: HTMLAudioElement;
    let audioContext: AudioContext;
    let sourceNode: MediaElementAudioSourceNode;
    let filters: BiquadFilterNode[] = [];
    const selectedProfile = writable('Flat'); // Default profile
    let customProfile: number[] = [0, 0, 0, 0, 0, 0];
  
    // Initialize the equalizer filters
    function setupEqualizer() {
      audioContext = new AudioContext();
      sourceNode = audioContext.createMediaElementSource(audioElement);
  
      // Create filters for each frequency
      frequencies.forEach((frequency) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1.0;
        filters.push(filter);
      });
  
      // Connect the filters in sequence
      filters.reduce((prev, curr) => prev.connect(curr), sourceNode).connect(audioContext.destination);
  
      applyProfile('Flat'); // Apply default profile
    }
  
    // Apply a preset or custom profile
    function applyProfile(profile: string | number[]) {
      const gains = typeof profile === 'string' ? equalizerProfiles[profile] : profile;
  
      gains.forEach((gain, index) => {
        filters[index].gain.value = gain;
      });
  
      if (typeof profile === 'string') {
        selectedProfile.set(profile);
      }
    }
  
    onMount(() => {
      audioElement.addEventListener('play', () => {
        if (!audioContext) setupEqualizer();
        audioContext.resume();
      });
    });
  
    onDestroy(() => {
      if (audioContext) {
        audioContext.close();
      }
    });
  </script>
  