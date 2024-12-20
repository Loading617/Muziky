<script lang="ts">
    import { parseBlob } from 'music-metadata-browser';
  
    type Track = {
      title: string;
      artist: string;
      album: string;
      duration: string;
      file: File;
      url: string;
    };
  
    let tracks: Track[] = [];
    let currentTrackIndex = 0;
    let audioElement: HTMLAudioElement;
  
    async function handleFolderSelection() {
      try {
        // Request a folder handle
        const folderHandle = await (window as any).showDirectoryPicker();
        const newTracks: Track[] = [];
  
        // Iterate over files in the folder
        for await (const [name, handle] of folderHandle.entries()) {
          if (handle.kind === 'file' && handle.name.match(/\.(mp3|wav|ogg)$/i)) {
            const file = await handle.getFile();
            const url = URL.createObjectURL(file);
  
            // Extract metadata
            const metadata = await parseBlob(file);
            const title = metadata.common.title || file.name;
            const artist = metadata.common.artist || 'Unknown Artist';
            const album = metadata.common.album || 'Unknown Album';
  
            const audio = new Audio(url);
            audio.onloadedmetadata = () => {
              const minutes = Math.floor(audio.duration / 60);
              const seconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');
              const duration = `${minutes}:${seconds}`;
  
              newTracks.push({ title, artist, album, duration, file, url });
            };
          }
        }
  
        // Update playlist
        tracks = newTracks;
      } catch (error) {
        console.error('Error reading folder:', error);
      }
    }
  
    function playTrack(index: number) {
      if (index >= 0 && index < tracks.length) {
        currentTrackIndex = index;
        audioElement.src = tracks[currentTrackIndex].url;
        audioElement.play();
      }
    }
  
    function playNext() {
      playTrack((currentTrackIndex + 1) % tracks.length);
    }
  
    function playPrevious() {
      playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
    }
  </script>
  
  <style>
    .player {
      font-family: Arial, sans-serif;
      max-width: 400px;
      margin: 1rem auto;
      text-align: center;
    }
  
    .playlist {
      margin-top: 1rem;
      text-align: left;
    }
  
    .playlist-item {
      cursor: pointer;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
  
    .playlist-item.active {
      background-color: #f0f0f0;
    }
  
    audio {
      width: 100%;
      margin-top: 1rem;
    }
  </style>
  
  <div class="player">
    <h2>Muziky</h2>
  
    <!-- Folder Selection -->
    <button on:click={handleFolderSelection}>Select Folder</button>
  
    <!-- Playlist -->
    {#if tracks.length > 0}
      <div class="playlist">
        <h3>Playlist</h3>
        <ul>
          {#each tracks as track, index}
            <li
              class="playlist-item {index === currentTrackIndex ? 'active' : ''}"
              on:click={() => playTrack(index)}
            >
              <strong>{track.title}</strong> - {track.artist}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  
    <!-- Audio Player -->
    {#if tracks.length > 0}
      <audio bind:this={audioElement} controls on:ended={playNext}></audio>
  
      <!-- Navigation Buttons -->
      <div>
        <button on:click={playPrevious}>Previous</button>
        <button on:click={playNext}>Next</button>
      </div>
    {/if}
  </div>
  