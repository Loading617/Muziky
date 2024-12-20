<script lang="ts">
    import { parseBlob } from 'music-metadata-browser';
    import { writable } from 'svelte/store';
  
    // Define track model
    interface Track {
      id: string; // Unique ID
      title: string;
      artist: string;
      album: string;
      duration: string;
      artwork: string;
      file: File;
      url: string;
    }
  
    // Reactive store for the music library
    const musicLibrary = writable<Track[]>([]);
  
    // Load library from localStorage on startup
    function loadLibrary() {
      const storedLibrary = localStorage.getItem('musicLibrary');
      if (storedLibrary) {
        musicLibrary.set(JSON.parse(storedLibrary));
      }
    }
  
    // Save library to localStorage
    musicLibrary.subscribe((library) => {
      localStorage.setItem('musicLibrary', JSON.stringify(library));
    });
  
    loadLibrary(); // Load library on initialization
  
    // Add tracks to the library
    async function addToLibrary(files: FileList) {
      for (const file of Array.from(files)) {
        if (!file.name.match(/\.(mp3|wav|ogg)$/i)) continue; // Only accept audio files
  
        const url = URL.createObjectURL(file);
        const metadata = await parseBlob(file);
        const title = metadata.common.title || file.name;
        const artist = metadata.common.artist || 'Unknown Artist';
        const album = metadata.common.album || 'Unknown Album';
        const artwork = metadata.common.picture
          ? `data:${metadata.common.picture[0].format};base64,${btoa(
              String.fromCharCode(...metadata.common.picture[0].data)
            )}`
          : '';
  
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          const minutes = Math.floor(audio.duration / 60);
          const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
          const duration = `${minutes}:${seconds}`;
  
          const newTrack: Track = {
            id: crypto.randomUUID(),
            title,
            artist,
            album,
            duration,
            artwork,
            file,
            url,
          };
  
          // Update library
          musicLibrary.update((library) => [...library, newTrack]);
        };
      }
    }
  
    let selectedTrack: Track | null = null;
  
    function playTrack(track: Track) {
      selectedTrack = track;
    }
  </script>
  
  <div class="library">
    <h2>Music Library</h2>
  
    <!-- File Upload -->
    <label>
      Add Music Files:
      <input type="file" multiple accept="audio/*" on:change={(e) => addToLibrary((e.target as HTMLInputElement).files!)} />
    </label>
  
    <!-- Display Library -->
    {#if $musicLibrary.length > 0}
      <h3>Your Library</h3>
      <div>
        {#each $musicLibrary as track}
          <div class="track" on:click={() => playTrack(track)}>
            {#if track.artwork}
              <img src={track.artwork} alt="Album Art" />
            {/if}
            <div>
              <strong>{track.title}</strong>
              <p>{track.artist} - {track.album}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  
    <!-- Now Playing -->
    {#if selectedTrack}
      <h3>Now Playing</h3>
      <div>
        {#if selectedTrack.artwork}
          <img src={selectedTrack.artwork} alt="Album Art" style="width: 100px; height: 100px;" />
        {/if}
        <p><strong>{selectedTrack.title}</strong></p>
        <p>{selectedTrack.artist} - {selectedTrack.album}</p>
      </div>
      <audio controls src={selectedTrack.url} autoplay></audio>
    {/if}
  </div>
  